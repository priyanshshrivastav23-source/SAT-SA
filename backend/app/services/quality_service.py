import re
from typing import List, Tuple, Dict, Any, Set
from app.parsers.base import NormalizedDocument, ExtractedTable
from app.schemas.analysis import QualityCheck, Finding


class QualityService:
    def evaluate_quality(
        self,
        norm_doc: NormalizedDocument,
        filename: str,
    ) -> Tuple[List[QualityCheck], List[Finding]]:
        """
        Runs comprehensive data quality checks on normalized document.
        Returns: (quality_checks, findings)
        """
        checks: List[QualityCheck] = []
        findings: List[Finding] = []
        finding_counter = 1

        def next_finding_id() -> str:
            nonlocal finding_counter
            fid = f"FIND-{finding_counter:03d}"
            finding_counter += 1
            return fid

        # 1. Check Completeness / Emptiness
        text_len = len(norm_doc.extracted_text.strip())
        if text_len == 0 and not norm_doc.tables:
            checks.append(
                QualityCheck(
                    check_id="QC-001",
                    check_name="Document Content Completeness",
                    category="completeness",
                    status="failed",
                    message="Document contains no readable text or structured table data.",
                    details={"text_length": 0, "tables_count": 0},
                )
            )
            findings.append(
                Finding(
                    finding_id=next_finding_id(),
                    title="Empty Document Content",
                    category="data_quality",
                    severity="critical",
                    finding_type="confirmed_error",
                    description="The uploaded document produced 0 bytes of readable text and 0 structured records.",
                    reason="Document is either blank, corrupted, or unsupported binary stream.",
                    evidence=f"Extracted characters: {text_len}",
                    source_location=filename,
                    recommended_action="Verify original document and re-upload an uncorrupted version.",
                )
            )
        elif text_len < 50 and not norm_doc.tables:
            checks.append(
                QualityCheck(
                    check_id="QC-001",
                    check_name="Document Content Completeness",
                    category="completeness",
                    status="warning",
                    message="Document contains very little text (< 50 characters).",
                    details={"text_length": text_len},
                )
            )
            findings.append(
                Finding(
                    finding_id=next_finding_id(),
                    title="Sparse Document Content",
                    category="data_quality",
                    severity="medium",
                    finding_type="warning",
                    description="Extracted document has exceptionally low text content.",
                    reason="Document may be a scanned image or placeholder stub.",
                    evidence=f"Text snippet: '{norm_doc.extracted_text[:40]}...'",
                    source_location=filename,
                    recommended_action="Inspect document manually; check if OCR is required.",
                )
            )
        else:
            checks.append(
                QualityCheck(
                    check_id="QC-001",
                    check_name="Document Content Completeness",
                    category="completeness",
                    status="passed",
                    message="Document contains sufficient extractable content.",
                    details={"text_length": text_len, "tables_count": len(norm_doc.tables)},
                )
            )

        # 2. Check Tables / Structured Data Quality
        if norm_doc.tables:
            for t_idx, table in enumerate(norm_doc.tables):
                table_loc = table.sheet_name or (f"Page {table.page_number}" if table.page_number else f"Table {t_idx+1}")

                # 2A. Duplicate Rows Check
                row_tuples = []
                for r in table.rows:
                    # Convert dict values to a frozen tuple representation
                    row_tuple = tuple(sorted((k, str(v).strip()) for k, v in r.items()))
                    row_tuples.append(row_tuple)

                total_rows = len(row_tuples)
                unique_rows = len(set(row_tuples))
                duplicate_count = total_rows - unique_rows

                if duplicate_count > 0:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-002-{t_idx+1}",
                            check_name=f"Duplicate Rows Check ({table.name})",
                            category="uniqueness",
                            status="warning",
                            message=f"Found {duplicate_count} duplicate row(s) out of {total_rows} sampled rows in '{table.name}'.",
                            details={"total_sampled_rows": total_rows, "duplicate_count": duplicate_count},
                        )
                    )
                    findings.append(
                        Finding(
                            finding_id=next_finding_id(),
                            title=f"Duplicate Rows Detected in {table.name}",
                            category="data_quality",
                            severity="medium",
                            finding_type="warning",
                            description=f"Identified {duplicate_count} exact duplicate record(s) within the table dataset.",
                            reason="Data ingestion pipeline or source export produced duplicate entries.",
                            evidence=f"Duplicate row count: {duplicate_count} in sample of {total_rows} rows",
                            source_location=table_loc,
                            recommended_action="Deduplicate dataset before relying on aggregate counts or statistics.",
                        )
                    )
                else:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-002-{t_idx+1}",
                            check_name=f"Duplicate Rows Check ({table.name})",
                            category="uniqueness",
                            status="passed",
                            message=f"No duplicate rows detected in sample of {total_rows} rows.",
                            details={"total_rows": total_rows, "duplicates": 0},
                        )
                    )

                # 2B. Missing Values / Null Density Check
                total_cells = total_rows * max(table.column_count, 1)
                empty_cells = 0
                cols_with_empty: Dict[str, int] = {}

                for r in table.rows:
                    for h in table.headers:
                        val = str(r.get(h, "")).strip()
                        if val in ("", "nan", "null", "none", "n/a", "-"):
                            empty_cells += 1
                            cols_with_empty[h] = cols_with_empty.get(h, 0) + 1

                null_percentage = (empty_cells / max(total_cells, 1)) * 100

                if null_percentage > 25.0:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-003-{t_idx+1}",
                            check_name=f"Missing Values Density ({table.name})",
                            category="completeness",
                            status="warning",
                            message=f"High missing value density: {null_percentage:.1f}% of cells are blank/null.",
                            details={"empty_cells": empty_cells, "null_percentage": round(null_percentage, 1), "empty_columns": cols_with_empty},
                        )
                    )
                    high_null_cols = [f"{col} ({cnt} blanks)" for col, cnt in cols_with_empty.items() if (cnt / max(total_rows, 1)) > 0.4]
                    findings.append(
                        Finding(
                            finding_id=next_finding_id(),
                            title=f"High Missing Value Density in {table.name}",
                            category="data_quality",
                            severity="medium",
                            finding_type="warning",
                            description=f"Table contains {null_percentage:.1f}% empty or null fields. Key columns may be sparsely populated.",
                            reason="Upstream logging gaps or optional form fields.",
                            evidence=f"Sparse columns: {', '.join(high_null_cols[:3]) if high_null_cols else 'Multiple columns'}",
                            source_location=table_loc,
                            recommended_action="Review data collection pipelines for dropped attributes.",
                        )
                    )
                else:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-003-{t_idx+1}",
                            check_name=f"Missing Values Density ({table.name})",
                            category="completeness",
                            status="passed",
                            message=f"Acceptable missing value rate: {null_percentage:.1f}%.",
                            details={"empty_cells": empty_cells, "null_percentage": round(null_percentage, 1)},
                        )
                    )

                # 2C. Missing / Unnamed Headers Check
                unnamed_headers = [h for h in table.headers if "unnamed" in h.lower() or h.startswith("Col_") or h.startswith("Column_")]
                if unnamed_headers and len(unnamed_headers) > 2:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-004-{t_idx+1}",
                            check_name=f"Column Header Integrity ({table.name})",
                            category="structure",
                            status="warning",
                            message=f"{len(unnamed_headers)} column(s) lack explicit header names.",
                            details={"unnamed_columns": unnamed_headers},
                        )
                    )
                    findings.append(
                        Finding(
                            finding_id=next_finding_id(),
                            title=f"Unnamed Columns in {table.name}",
                            category="structural",
                            severity="low",
                            finding_type="warning",
                            description="Dataset includes columns without clear header labels.",
                            reason="Missing row header in original spreadsheet or tabular export.",
                            evidence=f"Unnamed headers: {', '.join(unnamed_headers[:4])}",
                            source_location=table_loc,
                            recommended_action="Verify table header row alignment in original source file.",
                        )
                    )
                else:
                    checks.append(
                        QualityCheck(
                            check_id=f"QC-004-{t_idx+1}",
                            check_name=f"Column Header Integrity ({table.name})",
                            category="structure",
                            status="passed",
                            message="All columns possess defined header names.",
                        )
                    )

        # 3. Check Date Format Consistency
        all_text = norm_doc.extracted_text
        iso_dates = re.findall(r"\b\d{4}-\d{2}-\d{2}\b", all_text)
        slash_dates = re.findall(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b", all_text)
        written_dates = re.findall(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b", all_text, re.IGNORECASE)

        distinct_formats_count = sum(1 for fmt in [iso_dates, slash_dates, written_dates] if len(fmt) > 0)
        if distinct_formats_count >= 2 and (len(iso_dates) + len(slash_dates) + len(written_dates) > 5):
            checks.append(
                QualityCheck(
                    check_id="QC-005",
                    check_name="Date Format Consistency",
                    category="consistency",
                    status="warning",
                    message="Document uses multiple inconsistent date representations (e.g. ISO 8601 mixed with MM/DD/YYYY).",
                    details={"iso_count": len(iso_dates), "slash_count": len(slash_dates), "textual_count": len(written_dates)},
                )
            )
            findings.append(
                Finding(
                    finding_id=next_finding_id(),
                    title="Inconsistent Date Representations",
                    category="data_quality",
                    severity="low",
                    finding_type="observation",
                    description="Multiple date formatting styles were detected across the document body.",
                    reason="Aggregation of records from different tools or regions without timestamp normalization.",
                    evidence=f"Found {len(iso_dates)} ISO dates (YYYY-MM-DD) and {len(slash_dates)} slash dates (DD/MM/YYYY or MM/DD/YYYY)",
                    source_location=filename,
                    recommended_action="Standardize timestamps to ISO 8601 (UTC) format for accurate temporal analysis.",
                )
            )
        else:
            checks.append(
                QualityCheck(
                    check_id="QC-005",
                    check_name="Date Format Consistency",
                    category="consistency",
                    status="passed",
                    message="Date formats appear consistent across the document.",
                )
            )

        # 4. Check for Extraction Warnings
        if norm_doc.warnings:
            for w in norm_doc.warnings:
                checks.append(
                    QualityCheck(
                        check_id="QC-006",
                        check_name="Extraction Warning",
                        category="validity",
                        status="warning" if norm_doc.extraction_status != "failed" else "failed",
                        message=w,
                    )
                )

        return checks, findings


quality_service = QualityService()
