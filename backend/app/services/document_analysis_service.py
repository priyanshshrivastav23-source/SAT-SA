import re
import collections
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional

from app.parsers.base import NormalizedDocument, ExtractedTable, ExtractedSection
from app.services.soc_classification_service import soc_classifier
from app.services.quality_service import quality_service
from app.schemas.analysis import (
    DocumentOverview,
    ExtractedInformation,
    ExtractedDateItem,
    ExtractedEntityItem,
    ExtractedIdentifierItem,
    ExtractedKeyValueItem,
    ExtractedHeadingItem,
    ExtractedTermItem,
    ExtractedTableSummaryItem,
    QualityCheck,
    Finding,
    Limitation,
    DocumentAnalysisResponse,
)


STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with",
    "of", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can",
    "could", "should", "would", "may", "might", "must", "shall", "will", "this",
    "that", "these", "those", "it", "its", "as", "if", "not", "only", "than",
    "too", "very", "just", "so", "such", "no", "yes", "all", "any", "each", "other",
    "which", "who", "whom", "what", "where", "when", "why", "how", "page", "table",
    "row", "column", "dataset", "document", "section", "sheet", "total", "true", "false",
}


class DocumentAnalysisService:
    def analyze_document(
        self,
        document_id: str,
        filename: str,
        file_type: str,
        file_size_bytes: int,
        norm_doc: NormalizedDocument,
        analysis_version: int = 1,
    ) -> DocumentAnalysisResponse:
        """
        Executes generic rule-based document analysis pipeline:
        1. Document Overview & Summary Generation
        2. SOC Classification & Heuristics
        3. Key Information Extraction (Regex + Structural)
        4. Data Quality & Anomaly Checks
        5. Explainable Findings & Observations
        6. Analysis Limitations
        """
        full_text = norm_doc.extracted_text

        # 1. Classification
        detected_category, confidence, reasons = soc_classifier.classify(norm_doc, filename)

        # 2. Extract Key Information
        extracted_info = self._extract_key_information(norm_doc, full_text, filename)

        # 3. Quality Checks & Baseline Findings
        quality_checks, findings = quality_service.evaluate_quality(norm_doc, filename)

        # 4. Generate Document Specific Findings (Domain Observations)
        domain_findings = self._generate_domain_findings(norm_doc, extracted_info, detected_category, filename, len(findings))
        findings.extend(domain_findings)

        # 5. Determine Extraction Quality
        extraction_quality = self._assess_extraction_quality(norm_doc)

        # 6. Analysis Limitations
        limitations = self._generate_limitations(norm_doc, detected_category)

        # 7. Generate Concise Overview Summary
        summary = self._generate_summary(
            filename=filename,
            file_type=file_type,
            detected_category=detected_category,
            norm_doc=norm_doc,
            extracted_info=extracted_info,
            findings_count=len(findings),
        )

        overview = DocumentOverview(
            filename=filename,
            document_type=file_type,
            detected_category=detected_category,
            estimated_size_bytes=file_size_bytes,
            page_count=norm_doc.page_count,
            section_count=len(norm_doc.sections) if norm_doc.sections else None,
            sheet_count=len(norm_doc.sheet_names) if norm_doc.sheet_names else None,
            row_count=norm_doc.row_count,
            column_count=norm_doc.column_count,
            extraction_quality=extraction_quality,
            summary=summary,
        )

        status = "completed"
        if norm_doc.extraction_status == "failed":
            status = "failed"
        elif norm_doc.extraction_status == "ocr_required":
            status = "completed_with_warnings"

        return DocumentAnalysisResponse(
            document_id=document_id,
            status=status,
            analysis_version=analysis_version,
            document_overview=overview,
            extracted_information=extracted_info,
            quality_checks=quality_checks,
            findings=findings,
            limitations=limitations,
            created_at=datetime.now(timezone.utc),
        )

    def _extract_key_information(
        self,
        norm_doc: NormalizedDocument,
        text: str,
        filename: str,
    ) -> ExtractedInformation:
        """Extract dates, entities, identifiers, key metrics, headings, repeated terms, tables."""
        info = ExtractedInformation()

        # 1. Dates
        date_patterns = [
            (r"\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)?\b", "ISO Date"),
            (r"\b\d{1,2}/\d{1,2}/\d{2,4}\b", "Slash Date"),
            (r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b", "Textual Date"),
            (r"\bQ[1-4]\s*20\d{2}\b", "Quarter Period"),
            (r"\b(?:FY|FY-)\d{2,4}\b", "Fiscal Year"),
        ]
        seen_dates = set()
        for pattern, label in date_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                val = match.group(0).strip()
                if val not in seen_dates and len(info.dates) < 25:
                    seen_dates.add(val)
                    start = max(0, match.start() - 30)
                    end = min(len(text), match.end() + 30)
                    context_snippet = text[start:end].replace("\n", " ").strip()
                    info.dates.append(
                        ExtractedDateItem(
                            value=val,
                            context=f"...{context_snippet}...",
                            source_location=filename,
                        )
                    )

        # 2. Identifiers (Incident IDs, CVEs, IPs, Ticket IDs, Hashes)
        id_patterns = [
            (r"\bCVE-\d{4}-\d{4,7}\b", "cve_vulnerability"),
            (r"\b(?:INC|INCIDENT|TICK|TCK|CASE|ALERT|SEC)-[A-Z0-9_-]{3,15}\b", "incident_identifier"),
            (r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", "ipv4_address"),
            (r"\b[0-9a-fA-F]{32}\b", "md5_hash"),
            (r"\b[0-9a-fA-F]{64}\b", "sha256_hash"),
            (r"\bT1\d{3}(?:\.\d{3})?\b", "mitre_technique"),
        ]
        seen_ids = set()
        for pattern, id_type in id_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                val = match.group(0).strip()
                # Skip trivial IPs like 0.0.0.0 or 127.0.0.1 from repeated spam
                if val not in seen_ids and len(info.identifiers) < 30:
                    seen_ids.add(val)
                    start = max(0, match.start() - 30)
                    end = min(len(text), match.end() + 30)
                    context_snippet = text[start:end].replace("\n", " ").strip()
                    info.identifiers.append(
                        ExtractedIdentifierItem(
                            type=id_type,
                            value=val,
                            context=f"...{context_snippet}...",
                            source_location=filename,
                        )
                    )

        # 3. Organization / Entity Names
        org_patterns = [
            r"\b([A-Z][A-Za-z0-9&]+(?:\s+[A-Z][A-Za-z0-9&]+)*\s+(?:Inc|LLC|Corp|Corporation|Bank|Securities|Authority|Department|Ministry|CERT|SOC|Team|Group|Agency|Services|Technologies))\b",
        ]
        org_counts: Dict[str, int] = collections.Counter()
        for pattern in org_patterns:
            for match in re.finditer(pattern, text):
                val = match.group(1).strip()
                if len(val) > 4:
                    org_counts[val] += 1

        for org, count in org_counts.most_common(15):
            info.organizations.append(
                ExtractedEntityItem(
                    name=org,
                    category="organization",
                    frequency=count,
                    source_location=filename,
                )
            )

        # 4. Key Numerical Values & Metrics
        metric_patterns = [
            (r"(\b\d+(?:\.\d+)?%)\s*(?:SLA|compliance|accuracy|availability|uptime|coverage|false positive rate)?", "Percentage / Rate"),
            (r"(\$\s*\d+(?:,\d{3})*(?:\.\d+)?|\bINR\s*\d+(?:,\d{3})*|\bUSD\s*\d+(?:,\d{3})*)", "Monetary Value"),
            (r"(\b\d+(?:\.\d+)?\s*(?:hours|hrs|minutes|mins|seconds|sec|days|ms)\b)\s*(?:MTTR|MTTD|response time|turnaround|latency)?", "Duration / Latency"),
            (r"(\b\d{1,3}(?:,\d{3})+\b)\s*(?:alerts|events|logs|records|incidents|hosts)?", "High-Volume Count"),
        ]
        seen_metrics = set()
        for pattern, m_type in metric_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                val = match.group(1).strip()
                if val not in seen_metrics and len(info.key_values) < 20:
                    seen_metrics.add(val)
                    start = max(0, match.start() - 35)
                    end = min(len(text), match.end() + 35)
                    context_snippet = text[start:end].replace("\n", " ").strip()
                    info.key_values.append(
                        ExtractedKeyValueItem(
                            label=m_type,
                            value=val,
                            context=f"...{context_snippet}...",
                            source_location=filename,
                        )
                    )

        # 5. Headings
        for sec in norm_doc.sections:
            loc = (
                f"Page {sec.page_number}" if sec.page_number
                else f"Line {sec.line_number}" if sec.line_number
                else sec.sheet_name or filename
            )
            info.headings.append(
                ExtractedHeadingItem(
                    title=sec.title,
                    level=sec.level,
                    source_location=loc,
                )
            )

        # 6. Top Repeated Terms (Domain Keywords)
        words = re.findall(r"\b[a-zA-Z]{4,25}\b", text.lower())
        meaningful_words = [w for w in words if w not in STOPWORDS and not w.isnumeric()]
        word_counts = collections.Counter(meaningful_words)
        for term, freq in word_counts.most_common(15):
            info.repeated_terms.append(
                ExtractedTermItem(term=term, frequency=freq)
            )

        # 7. Tables Summary
        for t in norm_doc.tables:
            loc = (
                f"Page {t.page_number}" if t.page_number
                else f"Sheet: {t.sheet_name}" if t.sheet_name
                else filename
            )
            info.tables.append(
                ExtractedTableSummaryItem(
                    name=t.name,
                    row_count=t.row_count,
                    column_count=t.column_count,
                    headers=t.headers,
                    sample_rows=t.rows[:10],
                    source_location=loc,
                )
            )

        return info

    def _assess_extraction_quality(self, norm_doc: NormalizedDocument) -> str:
        """Determines extraction quality score."""
        if norm_doc.extraction_status == "failed":
            return "failed"
        if norm_doc.extraction_status == "ocr_required":
            return "ocr_required"
        if norm_doc.extraction_status == "partial":
            return "low"
        
        text_len = len(norm_doc.extracted_text.strip())
        if text_len > 2000 or (norm_doc.tables and any(t.row_count > 10 for t in norm_doc.tables)):
            return "high"
        elif text_len > 300 or norm_doc.tables:
            return "good"
        else:
            return "fair"

    def _generate_domain_findings(
        self,
        norm_doc: NormalizedDocument,
        extracted_info: ExtractedInformation,
        detected_category: str,
        filename: str,
        current_finding_count: int,
    ) -> List[Finding]:
        """Generate explainable findings based on detected patterns and anomalies."""
        findings = []
        counter = current_finding_count + 1

        def next_id() -> str:
            nonlocal counter
            fid = f"FIND-{counter:03d}"
            counter += 1
            return fid

        text_lower = norm_doc.extracted_text.lower()

        # 1. OCR Required Finding
        if norm_doc.extraction_status == "ocr_required":
            findings.append(
                Finding(
                    finding_id=next_id(),
                    title="Optical Character Recognition (OCR) Required",
                    category="structural",
                    severity="high",
                    finding_type="warning",
                    description="The document appears to be a scanned image or rasterized PDF. Direct text extraction yielded minimal readable characters.",
                    reason="Low character-per-page density in PDF stream.",
                    evidence=f"Page count: {norm_doc.page_count}, average chars/page < threshold.",
                    source_location=filename,
                    recommended_action="Execute document through an OCR pipeline before qualitative analysis.",
                )
            )

        # 2. SLA Breach Detection
        if "breach" in text_lower or "sla missed" in text_lower:
            findings.append(
                Finding(
                    finding_id=next_id(),
                    title="Document References SLA Breaches",
                    category="soc_observation",
                    severity="medium",
                    finding_type="observation",
                    description="Text content contains references to missed service-level agreement (SLA) targets or response deadlines.",
                    reason="Keyword pattern match: 'breach' or 'sla missed'.",
                    evidence="SLA threshold breach identified in document body.",
                    source_location=filename,
                    recommended_action="Review incident response logs for the specific breach periods.",
                )
            )

        # 3. High Criticality / CVE References
        cves = [id_item for id_item in extracted_info.identifiers if id_item.type == "cve_vulnerability"]
        if cves:
            findings.append(
                Finding(
                    finding_id=next_id(),
                    title=f"Security Vulnerability References ({len(cves)} CVEs)",
                    category="security_compliance",
                    severity="medium",
                    finding_type="observation",
                    description=f"Document explicitly references {len(cves)} common vulnerability identifiers (CVEs).",
                    reason="Detected CVE regex patterns.",
                    evidence=f"CVEs: {', '.join([c.value for c in cves[:4]])}",
                    source_location=filename,
                    recommended_action="Cross-reference CVE list against current patch and threat intelligence databases.",
                )
            )

        # 4. SOC Category Identified Finding
        if detected_category not in ["unknown", "general_document"]:
            cat_display = detected_category.replace("_", " ").title()
            findings.append(
                Finding(
                    finding_id=next_id(),
                    title=f"Document Classifies as '{cat_display}'",
                    category="soc_observation",
                    severity="info",
                    finding_type="observation",
                    description=f"Document structure and terminology strongly match '{cat_display}' supervisory dataset patterns.",
                    reason="Transparent keyword and table column heuristic scoring exceeded classification threshold.",
                    evidence=f"Category: {detected_category}",
                    source_location=filename,
                    recommended_action="Route document to the specialized SAT-SA SOC assessment module for in-depth gap analysis.",
                )
            )

        return findings

    def _generate_limitations(
        self,
        norm_doc: NormalizedDocument,
        detected_category: str,
    ) -> List[Limitation]:
        """Compile explicit analysis limitations."""
        limitations = [
            Limitation(
                limitation_id="LIM-001",
                title="Non-Tamper & Authenticity Limitation",
                category="validation_scope",
                description="Parsing and extraction success does not verify the legal authenticity, cryptographical provenance, or absence of post-facto tampering of the uploaded document.",
                impact="Document contents should be validated against primary system-of-record log streams.",
                recommended_workaround="Verify digital signatures or cross-reference SHA-256 with origin archives.",
            ),
        ]

        if norm_doc.extraction_status == "ocr_required":
            limitations.append(
                Limitation(
                    limitation_id="LIM-002",
                    title="Scanned Raster Content Limitation",
                    category="extraction",
                    description="Scanned or non-selectable raster text could not be extracted in offline MVP mode without OCR.",
                    impact="Tabular figures and textual narratives inside image scans are excluded from the current report.",
                    recommended_workaround="Upload machine-readable digital exports or run through an OCR pre-processor.",
                )
            )

        if detected_category in ["unknown", "general_document"]:
            limitations.append(
                Limitation(
                    limitation_id="LIM-003",
                    title="Generic Schema Domain Limitation",
                    category="schema",
                    description="This document lacks specific SOC schema markers (e.g. alert IDs, MTTR metrics, closure codes). Domain-specific SOC benchmarking was not applied.",
                    impact="Only generic structural and statistical validation was executed.",
                    recommended_workaround="If this is a SOC dataset, ensure standard header nomenclature is retained in source exports.",
                )
            )

        if norm_doc.document_type in ["xlsx", "csv"] and norm_doc.row_count and norm_doc.row_count > 5000:
            limitations.append(
                Limitation(
                    limitation_id="LIM-004",
                    title="Sampling Preview Limitation",
                    category="parsing",
                    description="For performance optimization, table previews in the analysis payload are sampled (up to 50 rows).",
                    impact="Full raw records are stored in local backend storage rather than inline in the lightweight JSON summary.",
                    recommended_workaround="Use the dedicated content endpoint or raw storage file for complete row-level auditing.",
                )
            )

        return limitations

    def _generate_summary(
        self,
        filename: str,
        file_type: str,
        detected_category: str,
        norm_doc: NormalizedDocument,
        extracted_info: ExtractedInformation,
        findings_count: int,
    ) -> str:
        """Create a human-readable summary of the document analysis."""
        cat_str = detected_category.replace("_", " ").title()
        parts = [
            f"Analyzed '{filename}' (format: {file_type.upper()}) as a '{cat_str}'.",
        ]

        # Scope
        scope_parts = []
        if norm_doc.page_count:
            scope_parts.append(f"{norm_doc.page_count} page(s)")
        if norm_doc.sheet_names:
            scope_parts.append(f"{len(norm_doc.sheet_names)} sheet(s)")
        if norm_doc.row_count:
            scope_parts.append(f"{norm_doc.row_count:,} data row(s)")
        if norm_doc.column_count:
            scope_parts.append(f"{norm_doc.column_count} column(s)")
        if norm_doc.sections:
            scope_parts.append(f"{len(norm_doc.sections)} section heading(s)")

        if scope_parts:
            parts.append(f"Document scope encompasses {', '.join(scope_parts)}.")

        # Entities and metrics
        info_parts = []
        if extracted_info.organizations:
            info_parts.append(f"entities: {', '.join([o.name for o in extracted_info.organizations[:3]])}")
        if extracted_info.dates:
            info_parts.append(f"{len(extracted_info.dates)} date reference(s)")
        if extracted_info.identifiers:
            info_parts.append(f"{len(extracted_info.identifiers)} identifier(s)")
        if extracted_info.tables:
            info_parts.append(f"{len(extracted_info.tables)} structured table(s)")

        if info_parts:
            parts.append(f"Extracted {'; '.join(info_parts)}.")

        # Findings summary
        if findings_count > 0:
            parts.append(f"Rule-based analysis flagged {findings_count} observation(s) and data quality check(s).")
        else:
            parts.append("No critical data quality or structural anomalies were detected.")

        return " ".join(parts)


document_analyzer = DocumentAnalysisService()
