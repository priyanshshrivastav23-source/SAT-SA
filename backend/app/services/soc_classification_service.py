import re
from typing import Dict, List, Tuple
from app.parsers.base import NormalizedDocument


SOC_CATEGORY_KEYWORDS: Dict[str, Dict[str, List[str]]] = {
    "soc_performance_report": {
        "strong": ["mttr", "mttd", "mean time to detect", "mean time to resolve", "analyst shift", "ticket volume", "queue backlog", "sla compliance"],
        "medium": ["throughput", "soc metrics", "analyst productivity", "incident count", "kpi", "burnout index", "first response time"],
    },
    "alert_incident_export": {
        "strong": ["alert_id", "source_ip", "dest_ip", "destination_ip", "rule_name", "mitre", "tactic", "technique_id", "signature_id"],
        "medium": ["severity", "src_port", "dst_port", "event_time", "siem", "edr", "ioc", "hash", "cve_id"],
    },
    "investigation_report": {
        "strong": ["incident timeline", "root cause analysis", "containment actions", "eradication", "forensic artifact", "adversary tactic", "indicators of compromise"],
        "medium": ["investigation summary", "killchain", "lateral movement", "privilege escalation", "exfiltration", "malware analysis"],
    },
    "case_closure_report": {
        "strong": ["case_id", "resolution_code", "closed_by", "closing_summary", "false_positive", "true_positive", "benign_positive"],
        "medium": ["disposition", "closure reason", "closure timestamp", "triage outcome", "remediation verified"],
    },
    "escalation_report": {
        "strong": ["tier 1 escalation", "tier 2 escalation", "escalated to l2", "escalated to l3", "escalation reason", "shift handoff"],
        "medium": ["escalated_by", "handoff notes", "priority escalation", "on-call engineer", "tier 2 review"],
    },
    "asset_inventory": {
        "strong": ["hostname", "mac_address", "ip_address", "asset_id", "criticality_rating", "asset_owner", "subnet", "cmdb"],
        "medium": ["operating_system", "os_version", "device_type", "patch_level", "workstation", "server_name"],
    },
    "sla_report": {
        "strong": ["sla breach", "sla target", "sla threshold", "service level agreement", "response sla", "resolution sla", "sla compliance rate"],
        "medium": ["breach duration", "contractual target", "sla status", "target met", "within sla"],
    },
}


class SOCClassificationService:
    def classify(self, norm_doc: NormalizedDocument, filename: str) -> Tuple[str, float, List[str]]:
        """
        Classify document using transparent heuristics across:
        1. Filename cues
        2. Extracted table headers
        3. Text keyword density
        
        Returns: (detected_category, confidence_score, reasons)
        """
        text_lower = norm_doc.extracted_text.lower()
        filename_lower = filename.lower()

        # Collect table column headers if any
        headers_lower: List[str] = []
        for t in norm_doc.tables:
            headers_lower.extend([h.lower() for h in t.headers])
        headers_str = " ".join(headers_lower)

        category_scores: Dict[str, float] = {cat: 0.0 for cat in SOC_CATEGORY_KEYWORDS}
        category_reasons: Dict[str, List[str]] = {cat: [] for cat in SOC_CATEGORY_KEYWORDS}

        for category, keyword_groups in SOC_CATEGORY_KEYWORDS.items():
            strong_matches = []
            medium_matches = []

            # 1. Filename match
            category_tokens = category.replace("_", " ").split()
            if any(token in filename_lower for token in category_tokens if len(token) > 3):
                category_scores[category] += 2.5
                category_reasons[category].append(f"Filename contains matching cue: '{filename}'")

            # 2. Table Headers match
            for kw in keyword_groups["strong"]:
                if kw in headers_str:
                    category_scores[category] += 3.0
                    strong_matches.append(f"table header '{kw}'")
            
            for kw in keyword_groups["medium"]:
                if kw in headers_str:
                    category_scores[category] += 1.5
                    medium_matches.append(f"table header '{kw}'")

            # 3. Text Body match
            for kw in keyword_groups["strong"]:
                count = len(re.findall(r"\b" + re.escape(kw) + r"\b", text_lower))
                if count > 0:
                    category_scores[category] += min(count * 2.0, 6.0)
                    strong_matches.append(f"term '{kw}' ({count}x)")

            for kw in keyword_groups["medium"]:
                count = len(re.findall(r"\b" + re.escape(kw) + r"\b", text_lower))
                if count > 0:
                    category_scores[category] += min(count * 0.8, 3.0)
                    medium_matches.append(f"term '{kw}' ({count}x)")

            if strong_matches:
                category_reasons[category].append(f"Identified strong markers: {', '.join(strong_matches[:4])}")
            if medium_matches:
                category_reasons[category].append(f"Identified secondary markers: {', '.join(medium_matches[:4])}")

        # Find best category
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        top_cat, top_score = sorted_categories[0]

        # Classification thresholds
        if top_score >= 4.0:
            confidence = min(round(top_score / 12.0, 2), 0.95)
            return top_cat, confidence, category_reasons[top_cat]
        elif top_score >= 2.0:
            confidence = 0.45
            return top_cat, confidence, category_reasons[top_cat]
        elif len(text_lower.strip()) > 50:
            return "general_document", 0.3, ["Document does not contain sufficient SOC-specific terminology."]
        else:
            return "unknown", 0.0, ["Insufficient text content to determine document category."]


soc_classifier = SOCClassificationService()
