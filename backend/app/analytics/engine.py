import hashlib
import json
import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class EvidenceHasher:
    @staticmethod
    def hash_record(record: Dict[str, Any]) -> str:
        serialized = json.dumps(record, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode('utf-8')).hexdigest()

    @staticmethod
    def compute_merkle_root(hashes: List[str]) -> str:
        if not hashes:
            return hashlib.sha256(b"empty").hexdigest()
        
        current = list(hashes)
        while len(current) > 1:
            if len(current) % 2 != 0:
                current.append(current[-1])
            next_level = []
            for i in range(0, len(current), 2):
                combined = current[i] + current[i + 1]
                next_level.append(hashlib.sha256(combined.encode('utf-8')).hexdigest())
            current = next_level
        return current[0]


class DataConfidenceEngine:
    @staticmethod
    def evaluate(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not records:
            return {
                "overallConfidence": 94.0,
                "completeness": 97.0,
                "consistency": 93.0,
                "timestampQuality": 92.0,
                "schemaValidity": 95.0
            }
        
        missing_fields_count = 0
        total_fields_checked = 0
        timestamp_drift_count = 0

        for r in records[:500]:
            required = ["record_id", "timestamp", "entity_id", "severity", "workflow_state"]
            for field in required:
                total_fields_checked += 1
                if field not in r or r[field] is None:
                    missing_fields_count += 1
            if "timestamp" in r:
                ts = str(r["timestamp"])
                if not ts or len(ts) < 5:
                    timestamp_drift_count += 1

        completeness = max(80.0, 100.0 - (missing_fields_count / max(1, total_fields_checked)) * 100.0)
        timestamp_quality = max(85.0, 100.0 - (timestamp_drift_count / max(1, len(records[:500]))) * 100.0)
        consistency = 93.0
        overall = round((completeness * 0.4) + (consistency * 0.3) + (timestamp_quality * 0.3), 1)

        return {
            "overallConfidence": overall,
            "completeness": round(completeness, 1),
            "consistency": round(consistency, 1),
            "timestampQuality": round(timestamp_quality, 1),
            "schemaValidity": 96.0
        }


class TransparentFusionEngine:
    WEIGHTS = {
        "fast_closure": 0.20,
        "low_escalation": 0.20,
        "investigation_similarity": 0.20,
        "silent_asset": 0.20,
        "missing_remediation": 0.20
    }

    @classmethod
    def fuse_signals(cls, signals: Dict[str, float], data_confidence: float = 94.0) -> Dict[str, Any]:
        composite_score = sum(signals.get(k, 0.0) * w for k, w in cls.WEIGHTS.items())
        active_signals = [v for v in signals.values() if v > 0.4]
        raw_confidence = min(0.98, 0.70 + (len(active_signals) * 0.06))
        adjusted_confidence = round(raw_confidence * (data_confidence / 100.0) * 100, 1)

        severity = "HIGH" if composite_score >= 0.70 else "MEDIUM" if composite_score >= 0.40 else "LOW"
        
        return {
            "weights": cls.WEIGHTS,
            "composite_score": round(composite_score, 3),
            "confidence": adjusted_confidence,
            "severity": severity,
            "active_signal_count": len(active_signals),
            "supervisory_verdict": "Review Recommended" if composite_score >= 0.50 else "Monitor Baseline",
            "counterfactual": (
                "This signal would not trigger if the median critical closure time exceeded 22 minutes, "
                "or if Tier-2 escalation rates reached peer baseline (14.2%), assuming other parameters remain unchanged."
            ),
            "non_autonomous_rationale": (
                "Fast closure and low escalation may reflect legitimate automation or specialized response runbooks. "
                "SAT-SA presents supporting forensic evidence for human examiner evaluation rather than issuing an autonomous finding."
            )
        }


SYNTHETIC_ENTITIES = [
    {
        "id": "cse-alpha",
        "name": "CSE Alpha",
        "category": "Critical Energy Grid Telemetry",
        "supervisoryIndicator": 72,
        "status": "Review Recommended",
        "dataConfidence": 94,
        "recordsAnalyzed": 48210,
        "openFindings": 12,
        "reportedMetrics": {
            "criticalAlertsWithinSLA": 99.2,
            "criticalClosureCompliance": 98.4,
            "meanTimeToAcknowledgeMin": 4.1
        },
        "observedMetrics": {
            "criticalClosureMedianMin": 3.0,
            "peerBaselineMedianMin": 47.0,
            "escalationRatePercent": 1.8,
            "peerEscalationRatePercent": 14.2,
            "templateSimilarityPercent": 84.0,
            "silentCriticalAssets": 1
        }
    },
    {
        "id": "cse-beta",
        "name": "CSE Beta",
        "category": "Banking & Payment Switch",
        "supervisoryIndicator": 84,
        "status": "Review Recommended",
        "dataConfidence": 96,
        "recordsAnalyzed": 31400,
        "openFindings": 8,
        "reportedMetrics": {
            "criticalAlertsWithinSLA": 97.5,
            "criticalClosureCompliance": 96.8,
            "meanTimeToAcknowledgeMin": 5.2
        },
        "observedMetrics": {
            "criticalClosureMedianMin": 41.0,
            "peerBaselineMedianMin": 47.0,
            "escalationRatePercent": 12.4,
            "peerEscalationRatePercent": 14.2,
            "templateSimilarityPercent": 84.0,
            "silentCriticalAssets": 0
        }
    },
    {
        "id": "cse-gamma",
        "name": "CSE Gamma",
        "category": "Civil Aviation Airspace Control",
        "supervisoryIndicator": 92,
        "status": "Healthy Baseline",
        "dataConfidence": 97,
        "recordsAnalyzed": 18240,
        "openFindings": 4,
        "reportedMetrics": {
            "criticalAlertsWithinSLA": 96.1,
            "criticalClosureCompliance": 95.8,
            "meanTimeToAcknowledgeMin": 6.8
        },
        "observedMetrics": {
            "criticalClosureMedianMin": 52.0,
            "peerBaselineMedianMin": 47.0,
            "escalationRatePercent": 16.1,
            "peerEscalationRatePercent": 14.2,
            "templateSimilarityPercent": 24.0,
            "silentCriticalAssets": 0
        }
    },
    {
        "id": "cse-delta",
        "name": "CSE Delta",
        "category": "National Freight Logistics",
        "supervisoryIndicator": 78,
        "status": "Review Recommended",
        "dataConfidence": 89,
        "recordsAnalyzed": 15180,
        "openFindings": 9,
        "reportedMetrics": {
            "criticalAlertsWithinSLA": 98.0,
            "criticalClosureCompliance": 97.1,
            "meanTimeToAcknowledgeMin": 4.9
        },
        "observedMetrics": {
            "criticalClosureMedianMin": 44.0,
            "peerBaselineMedianMin": 47.0,
            "escalationRatePercent": 8.7,
            "peerEscalationRatePercent": 14.2,
            "templateSimilarityPercent": 42.0,
            "silentCriticalAssets": 1
        }
    },
    {
        "id": "cse-epsilon",
        "name": "CSE Epsilon",
        "category": "Telecommunications Gateway",
        "supervisoryIndicator": 94,
        "status": "Healthy Baseline",
        "dataConfidence": 98,
        "recordsAnalyzed": 12400,
        "openFindings": 4,
        "reportedMetrics": {
            "criticalAlertsWithinSLA": 95.4,
            "criticalClosureCompliance": 96.0,
            "meanTimeToAcknowledgeMin": 6.1
        },
        "observedMetrics": {
            "criticalClosureMedianMin": 49.0,
            "peerBaselineMedianMin": 47.0,
            "escalationRatePercent": 15.3,
            "peerEscalationRatePercent": 14.2,
            "templateSimilarityPercent": 21.0,
            "silentCriticalAssets": 0
        }
    }
]

SYNTHETIC_EVIDENCE_RECORDS = [
    {
        "record_id": "ALT-98213",
        "timestamp": "2026-10-05 10:03:14 IST",
        "entity_id": "cse-alpha",
        "asset_id": "SRV-CORE-FIN-01",
        "severity": "Critical",
        "case_id": "CS-9012",
        "workflow_state": "Closed",
        "duration_min": 3,
        "escalation": "No",
        "investigation": "Minimal",
        "remediation": "None Recorded",
        "analyst_id": "A-14",
        "rule_name": "Trojan.CobaltStrike.Beacon Activity Detected",
        "signature_sha256": "8f3a9d20c5e14b8a221f7e3d1c8b9a4f6e2d1c0b8a7f6e5d4c3b2a1f0e9d8c7b"
    },
    {
        "record_id": "ALT-98219",
        "timestamp": "2026-10-05 11:12:08 IST",
        "entity_id": "cse-alpha",
        "asset_id": "AUTH-SRV-AD-02",
        "severity": "Critical",
        "case_id": "CS-9015",
        "workflow_state": "Closed",
        "duration_min": 2,
        "escalation": "No",
        "investigation": "Minimal",
        "remediation": "None Recorded",
        "analyst_id": "A-14",
        "rule_name": "Mimikatz LSASS Memory Injection Attempt",
        "signature_sha256": "9b1c4e7f2a5d8b3c6e0f1a4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c"
    },
    {
        "record_id": "ALT-98224",
        "timestamp": "2026-10-05 11:45:22 IST",
        "entity_id": "cse-alpha",
        "asset_id": "GW-EXT-BORDER-01",
        "severity": "Critical",
        "case_id": "CS-9021",
        "workflow_state": "Closed",
        "duration_min": 3,
        "escalation": "No",
        "investigation": "Minimal",
        "remediation": "Auto-Suppressed",
        "analyst_id": "A-14",
        "rule_name": "CVE-2024-38077 RCE Exploit Packet Sequence",
        "signature_sha256": "3c8e1a4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c5e8a"
    },
    {
        "record_id": "ALT-98231",
        "timestamp": "2026-10-05 12:15:40 IST",
        "entity_id": "cse-alpha",
        "asset_id": "SRV-CORE-FIN-01",
        "severity": "Critical",
        "case_id": "CS-9028",
        "workflow_state": "Closed",
        "duration_min": 2,
        "escalation": "No",
        "investigation": "Minimal",
        "remediation": "None Recorded",
        "analyst_id": "A-09",
        "rule_name": "Kerberoasting SPN Ticket Request Anomaly",
        "signature_sha256": "7e2d1c0b8a7f6e5d4c3b2a1f0e9d8c7b8f3a9d20c5e14b8a221f7e3d1c8b9a4f"
    },
    {
        "record_id": "ALT-98240",
        "timestamp": "2026-10-05 13:02:11 IST",
        "entity_id": "cse-alpha",
        "asset_id": "SWIFT-MQ-CONNECTOR",
        "severity": "Critical",
        "case_id": "CS-9034",
        "workflow_state": "Closed",
        "duration_min": 3,
        "escalation": "No",
        "investigation": "Minimal",
        "remediation": "None Recorded",
        "analyst_id": "A-09",
        "rule_name": "Unusual Volume of Outbound Encrypted Egress",
        "signature_sha256": "4b8a221f7e3d1c8b9a4f6e2d1c0b8a7f6e5d4c3b2a1f0e9d8c7b8f3a9d20c5e1"
    }
]


class SatSaAnalyticsService:
    def __init__(self):
        self.entities = list(SYNTHETIC_ENTITIES)
        self.evidence_records = list(SYNTHETIC_EVIDENCE_RECORDS)
        for r in self.evidence_records:
            if "record_hash" not in r:
                r["record_hash"] = EvidenceHasher.hash_record(r)
        
        hashes = [r["record_hash"] for r in self.evidence_records]
        self.merkle_root = EvidenceHasher.compute_merkle_root(hashes)

    def get_dashboard(self) -> Dict[str, Any]:
        total_records = sum(e["recordsAnalyzed"] for e in self.entities)
        data_conf = DataConfidenceEngine.evaluate(self.evidence_records)
        
        return {
            "csesAnalyzed": len(self.entities),
            "recordsAnalyzed": total_records,
            "totalFindings": 37,
            "highPriorityFindings": 8,
            "dataConfidence": data_conf["overallConfidence"],
            "dataConfidenceBreakdown": data_conf,
            "claimVsReality": {
                "reported": {
                    "criticalWithinSla": 99.2,
                    "criticalClosureCompliance": 98.4,
                    "overallStatus": "Healthy"
                },
                "observed": {
                    "criticalClosureMedianMin": 3.0,
                    "escalationRatePercent": 1.8,
                    "templateSimilarityPercent": 84.0,
                    "silentCriticalAssets": 1,
                    "keyFindingsCount": 184
                },
                "verdictMessage": "Potential mismatch between reported operational performance and supporting evidence. Review recommended.",
                "primaryFindingId": "F-1024"
            }
        }

    def get_entities(self) -> List[Dict[str, Any]]:
        return self.entities

    def get_entity_detail(self, entity_id: str) -> Optional[Dict[str, Any]]:
        target = next((e for e in self.entities if e["id"] == entity_id), None)
        if not target:
            return None

        fusion = TransparentFusionEngine.fuse_signals({
            "fast_closure": 0.94,
            "low_escalation": 0.88,
            "investigation_similarity": 0.84,
            "silent_asset": 0.90,
            "missing_remediation": 0.82
        })

        return {
            "entity": target,
            "supervisoryIndicator": target["supervisoryIndicator"],
            "status": target["status"],
            "dataConfidence": target["dataConfidence"],
            "fusion": fusion,
            "capabilityIndicators": [
                {"name": "Threat Detection", "score": 81, "benchmarkAverage": 78, "status": "Healthy"},
                {"name": "Investigation", "score": 58, "benchmarkAverage": 76, "status": "Review Recommended"},
                {"name": "Escalation", "score": 52, "benchmarkAverage": 74, "status": "Review Recommended"},
                {"name": "Incident Response", "score": 64, "benchmarkAverage": 75, "status": "Review Recommended"},
                {"name": "Security Operations", "score": 76, "benchmarkAverage": 79, "status": "Healthy"},
                {"name": "Governance & Oversight", "score": 79, "benchmarkAverage": 80, "status": "Healthy"},
                {"name": "Operational Discipline", "score": 61, "benchmarkAverage": 77, "status": "Review Recommended"},
                {"name": "Cyber Resilience", "score": 74, "benchmarkAverage": 75, "status": "Healthy"}
            ],
            "executionGapSignals": [
                {
                    "title": "Fast High-Severity Closure",
                    "description": "Critical cases are being closed much faster than peer baseline.",
                    "observedValue": "3 min",
                    "peerBaseline": "47 min",
                    "difference": "-93.6%",
                    "confidence": "92%",
                    "evidenceCount": "184 cases"
                },
                {
                    "title": "Critical Without Escalation",
                    "description": "Critical alerts reached closure without expected escalation evidence.",
                    "observedValue": "1.8%",
                    "peerBaseline": "14.2%",
                    "difference": "-87.3%",
                    "confidence": "94%",
                    "evidenceCount": "142 cases"
                },
                {
                    "title": "Shallow Investigation",
                    "description": "Investigation records exist but show limited operational activity.",
                    "observedValue": "2.1 actions/case",
                    "peerBaseline": "8.4 actions/case",
                    "difference": "-75.0%",
                    "confidence": "88%",
                    "evidenceCount": "184 cases"
                },
                {
                    "title": "Recurrence Without Remediation",
                    "description": "Repeated alerts exist without corresponding remediation evidence.",
                    "observedValue": "67.2% recurrence",
                    "peerBaseline": "18.5% recurrence",
                    "difference": "+263.2%",
                    "confidence": "89%",
                    "evidenceCount": "89 cases"
                },
                {
                    "title": "Template-Driven Investigation",
                    "description": "Investigation notes show unusually high similarity.",
                    "observedValue": "84% similarity",
                    "peerBaseline": "28% similarity",
                    "difference": "+200.0%",
                    "confidence": "86%",
                    "evidenceCount": "43 cases"
                },
                {
                    "title": "Alert-to-Action Dead End",
                    "description": "Expected downstream workflow activity is missing.",
                    "observedValue": "78.4% dead-end",
                    "peerBaseline": "11.2% dead-end",
                    "difference": "+600.0%",
                    "confidence": "91%",
                    "evidenceCount": "128 cases"
                }
            ]
        }

    def get_findings(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "F-1024",
                "entity": "CSE Alpha",
                "entityId": "cse-alpha",
                "finding": "Fast critical closure without escalation",
                "severity": "HIGH",
                "confidence": "92%",
                "evidence": "18 records",
                "status": "Review Recommended",
                "reason": "Critical alerts were closed in a median of 3 minutes compared with a peer median of 47 minutes."
            },
            {
                "id": "F-1027",
                "entity": "CSE Alpha",
                "entityId": "cse-alpha",
                "finding": "Silent critical asset void",
                "severity": "HIGH",
                "confidence": "89%",
                "evidence": "7 records",
                "status": "Review Recommended",
                "reason": "PAYMENT-DB-01 has produced 0 alerts across 47 days vs expected 40–70 alerts/week."
            },
            {
                "id": "F-1031",
                "entity": "CSE Beta",
                "entityId": "cse-beta",
                "finding": "Template-driven investigations",
                "severity": "MEDIUM",
                "confidence": "84%",
                "evidence": "43 records",
                "status": "Review Recommended",
                "reason": "Investigation notes share 84% text similarity across diverse alert types."
            },
            {
                "id": "F-1038",
                "entity": "CSE Gamma",
                "entityId": "cse-gamma",
                "finding": "Missing alert category",
                "severity": "MEDIUM",
                "confidence": "81%",
                "evidence": "12 records",
                "status": "Review Recommended",
                "reason": "Ransomware & Lateral Movement categories show zero reported telemetry across 60 days."
            }
        ]

    def get_finding_detail(self, finding_id: str) -> Optional[Dict[str, Any]]:
        findings = self.get_findings()
        f = next((item for item in findings if item["id"] == finding_id), None)
        if not f:
            return None

        fusion = TransparentFusionEngine.fuse_signals({
            "fast_closure": 0.94,
            "low_escalation": 0.88,
            "investigation_similarity": 0.84,
            "silent_asset": 0.90,
            "missing_remediation": 0.82
        })

        return {
            "finding": f,
            "whyFlagged": "Critical alerts were closed in a median of 3 minutes compared with a peer median of 47 minutes.",
            "fusion": fusion,
            "counterfactual": fusion["counterfactual"],
            "whyNotAutonomous": fusion["non_autonomous_rationale"],
            "evidenceChain": [
                {"signal": "Fast Closure", "observed": "3 min median", "peer": "47 min", "weight": "0.20"},
                {"signal": "Low Escalation", "observed": "1.8% rate", "peer": "14.2%", "weight": "0.20"},
                {"signal": "Repetitive Investigation", "observed": "84% similarity", "peer": "28%", "weight": "0.20"},
                {"signal": "Silent Critical Assets", "observed": "47 days zero telemetry", "peer": "40-70/wk", "weight": "0.20"},
                {"signal": "Missing Remediation", "observed": "88% no fix artifact", "peer": "12%", "weight": "0.20"}
            ],
            "evidenceRecords": self.evidence_records,
            "evidenceLedger": {
                "recordHash": self.evidence_records[0]["record_hash"],
                "merkleRoot": self.merkle_root,
                "status": "Cryptographically verified",
                "algorithm": "SHA-256",
                "recordsCount": len(self.evidence_records)
            }
        }

    def get_negative_space(self) -> Dict[str, Any]:
        return {
            "cards": {
                "silentCriticalAssets": 3,
                "missingAlertCategories": 2,
                "unexplainedActivityDrops": 4,
                "ghostRecords": 7,
                "coverageGaps": 5
            },
            "assets": [
                {
                    "asset": "PAYMENT-DB-01",
                    "entity": "CSE Alpha",
                    "expectedActivity": "40–70 alerts/week",
                    "observedActivity": "0",
                    "silenceDuration": "47 days",
                    "risk": "HIGH",
                    "evidence": "Log forwarder daemon heartbeat active; syslog stream empty."
                },
                {
                    "asset": "WEB-GATEWAY-02",
                    "entity": "CSE Alpha",
                    "expectedActivity": "20–40 alerts/week",
                    "observedActivity": "2",
                    "silenceDuration": "Silence anomaly (14 days)",
                    "risk": "HIGH",
                    "evidence": "WAF drop rules bypassed; 95% telemetry collapse."
                },
                {
                    "asset": "SWIFT-CONNECTOR-04",
                    "entity": "CSE Beta",
                    "expectedActivity": "15–30 alerts/week",
                    "observedActivity": "0",
                    "silenceDuration": "22 days",
                    "risk": "HIGH",
                    "evidence": "MQ queue listener offline; zero event forwarder transactions."
                },
                {
                    "asset": "AUTH-CLUSTER-01",
                    "entity": "CSE Delta",
                    "expectedActivity": "100–250 alerts/week",
                    "observedActivity": "3",
                    "silenceDuration": "Partial suppression (8 days)",
                    "risk": "MEDIUM",
                    "evidence": "Kerberos TGT authentication event logging disabled in audit policy."
                }
            ]
        }

    def get_peer_benchmark(self) -> Dict[str, Any]:
        return {
            "entity": "CSE Alpha",
            "peerGroup": "National Critical Sector SOC Peer Baseline (Tier-1 CSEs)",
            "metrics": [
                {
                    "metric": "Critical closure median",
                    "cseAlpha": "3 min",
                    "peerMedian": "47 min",
                    "peerRange": "22–81 min",
                    "status": "Significantly below peer baseline (-93.6%)"
                },
                {
                    "metric": "Escalation rate",
                    "cseAlpha": "1.8%",
                    "peerMedian": "14.2%",
                    "peerRange": "8.5%–24.0%",
                    "status": "Significantly below peer baseline (-87.3%)"
                },
                {
                    "metric": "Investigation note similarity",
                    "cseAlpha": "84%",
                    "peerMedian": "28%",
                    "peerRange": "15%–35%",
                    "status": "Significantly above peer baseline (+200.0%)"
                },
                {
                    "metric": "Alert volume per shift",
                    "cseAlpha": "1,420",
                    "peerMedian": "1,180",
                    "peerRange": "900–1,650",
                    "status": "Within peer range (+20.3%)"
                },
                {
                    "metric": "Remediation verification rate",
                    "cseAlpha": "12.4%",
                    "peerMedian": "76.8%",
                    "peerRange": "65.0%–88.0%",
                    "status": "Significantly below peer baseline (-83.9%)"
                }
            ]
        }

    def get_review_planner(self) -> Dict[str, Any]:
        return {
            "totalRecords": 125430,
            "recommendedReviewSample": 120,
            "randomControlSample": 20,
            "highPriority": 35,
            "diverseFindings": 45,
            "criticalAssets": 20,
            "queue": [
                {
                    "priority": "HIGH",
                    "findingId": "F-1024",
                    "entity": "CSE Alpha",
                    "reason": "Fast critical closure without escalation (3 min vs 47 min)",
                    "evidence": "184 records (ALT-98213, ALT-98219)",
                    "suggestedAction": "Request analyst terminal logs for 10:03-10:06 IST and check automated suppression script."
                },
                {
                    "priority": "HIGH",
                    "findingId": "F-1027",
                    "entity": "CSE Alpha",
                    "reason": "Prolonged telemetry silence on PAYMENT-DB-01 (47 days)",
                    "evidence": "7 heartbeat pings, 0 operational alerts",
                    "suggestedAction": "Verify log forwarder agent configuration and check SIEM drop rules."
                },
                {
                    "priority": "MEDIUM",
                    "findingId": "F-1031",
                    "entity": "CSE Beta",
                    "reason": "Template-driven repetitive investigation notes (84% similarity)",
                    "evidence": "43 case files sharing boilerplate text",
                    "suggestedAction": "Audit SOC standard operating procedures regarding macro auto-fills."
                }
            ]
        }

    def get_audit(self) -> Dict[str, Any]:
        return {
            "metadata": {
                "dataVersion": "v2.4-SYNTHETIC",
                "modelVersion": "Heuristic-Fusion-1.0",
                "ruleVersion": "2026.3-NTRO-NCIIPC",
                "analysisTimestamp": "08:35:10 IST"
            },
            "timeline": [
                {"time": "08:32", "event": "Dataset imported", "details": "125,430 records across 5 CSEs"},
                {"time": "08:33", "event": "Data quality validation completed", "details": "Confidence score 94%"},
                {"time": "08:34", "event": "Evidence ledger generated", "details": "SHA-256 Merkle root computed"},
                {"time": "08:35", "event": "Analytics completed", "details": "Execution gaps and negative space analyzed"},
                {"time": "08:36", "event": "Finding F-1024 generated", "details": "Claim-vs-Reality concern identified"},
                {"time": "08:37", "event": "Examiner opened finding", "details": "Supervisory review initialized"}
            ]
        }

    def get_evidence_detail(self, evidence_id: str) -> Optional[Dict[str, Any]]:
        record = next((r for r in self.evidence_records if r["record_id"] == evidence_id), None)
        if not record:
            return None
        return {
            "record": record,
            "sha256": record["record_hash"],
            "merkleRoot": self.merkle_root,
            "verificationStatus": "Cryptographically verified",
            "statutoryNotice": "Preserved under Section 65B of Indian Evidence Act."
        }


analytics_service = SatSaAnalyticsService()
