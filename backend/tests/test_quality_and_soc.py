from app.parsers.csv_parser import CSVParser
from app.parsers.text_parser import TextParser
from app.services.quality_service import quality_service
from app.services.soc_classification_service import soc_classifier
from app.soc_modules.interfaces import (
    ExecutionGapEngineInterface,
    NegativeSpaceEngineInterface,
    PeerBenchmarkingEngineInterface,
    GoodhartLensInterface,
    EvidenceFusionInterface,
    ReviewPlannerInterface,
    SOCEngineResult,
)
from tests.conftest import create_synthetic_csv


def test_quality_service_duplicate_detection():
    parser = CSVParser()
    csv_bytes = create_synthetic_csv(with_duplicates=True)
    norm_doc = parser.parse(csv_bytes, "dups.csv")
    
    checks, findings = quality_service.evaluate_quality(norm_doc, "dups.csv")
    
    dup_check = next((c for c in checks if "Duplicate" in c.check_name), None)
    assert dup_check is not None
    assert dup_check.status == "warning"
    assert dup_check.details["duplicate_count"] == 1

    dup_finding = next((f for f in findings if "Duplicate" in f.title), None)
    assert dup_finding is not None
    assert dup_finding.severity == "medium"
    assert "Deduplicate" in dup_finding.recommended_action


def test_quality_service_missing_values():
    parser = CSVParser()
    csv_bytes = create_synthetic_csv(with_nulls=True)
    norm_doc = parser.parse(csv_bytes, "nulls.csv")
    
    checks, findings = quality_service.evaluate_quality(norm_doc, "nulls.csv")
    null_check = next((c for c in checks if "Missing Values" in c.check_name), None)
    assert null_check is not None
    assert null_check.status in ["passed", "warning"]


def test_soc_classification_alert_export():
    parser = CSVParser()
    csv_bytes = create_synthetic_csv()
    norm_doc = parser.parse(csv_bytes, "alerts_export.csv")
    
    category, confidence, reasons = soc_classifier.classify(norm_doc, "alerts_export.csv")
    assert category == "alert_incident_export"
    assert confidence > 0.4
    assert len(reasons) > 0


def test_soc_classification_general_document():
    parser = TextParser()
    text = "Meeting minutes for the quarterly company picnic. Location: City Park."
    norm_doc = parser.parse(text.encode("utf-8"), "picnic_notes.txt")
    
    category, confidence, reasons = soc_classifier.classify(norm_doc, "picnic_notes.txt")
    assert category in ["general_document", "unknown"]


def test_future_soc_interfaces_exist():
    # Verify that future SOC engines have proper ABC interface definitions
    class DummyExecutionGap(ExecutionGapEngineInterface):
        def validate_schema(self, norm_doc):
            return True

        def evaluate(self, norm_doc):
            return SOCEngineResult(
                engine_name="ExecutionGapEngine",
                is_ready=False,
                applicable_category="soc_performance_report",
                schema_valid=True,
            )

    dummy = DummyExecutionGap()
    assert dummy.validate_schema(None) is True
    res = dummy.evaluate(None)
    assert res.engine_name == "ExecutionGapEngine"
    assert res.is_ready is False
