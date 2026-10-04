import io
import pytest
from app.parsers.pdf_parser import PDFParser
from app.parsers.docx_parser import DocxParser
from app.parsers.text_parser import TextParser
from app.parsers.csv_parser import CSVParser
from app.parsers.json_parser import JSONParser
from app.parsers.excel_parser import ExcelParser
from tests.conftest import (
    create_synthetic_pdf,
    create_scanned_synthetic_pdf,
    create_synthetic_docx,
    create_synthetic_csv,
    create_synthetic_xlsx,
    create_synthetic_json,
)


def test_pdf_parser_text_extraction():
    parser = PDFParser()
    pdf_bytes = create_synthetic_pdf("SOC Assessment Report - Year 2026\nIncident: INC-8821\nStatus: Closed")
    doc = parser.parse(pdf_bytes, "test_report.pdf")
    
    assert doc.document_type == "pdf"
    assert doc.extraction_status == "success"
    assert doc.page_count == 1
    assert "SOC Assessment Report" in doc.extracted_text
    assert "INC-8821" in doc.extracted_text


def test_pdf_parser_scanned_ocr_detection():
    parser = PDFParser()
    scanned_bytes = create_scanned_synthetic_pdf()
    doc = parser.parse(scanned_bytes, "scanned_invoice.pdf")
    
    assert doc.document_type == "pdf"
    assert doc.extraction_status == "ocr_required"
    assert any("OCR" in w for w in doc.warnings)


def test_docx_parser():
    parser = DocxParser()
    docx_bytes = create_synthetic_docx("Incident Investigation Report", "Timeline: Alert escalated at 14:00 UTC.")
    doc = parser.parse(docx_bytes, "report.docx")
    
    assert doc.document_type == "docx"
    assert doc.extraction_status == "success"
    assert "Incident Investigation Report" in doc.extracted_text
    assert len(doc.tables) >= 1
    assert "Alert ID" in doc.tables[0].headers


def test_text_parser():
    parser = TextParser()
    raw_text = "# Executive Summary\n\nAll SOC KPIs met SLA targets in Q1 2026.\n\n# Incident Log\nINC-101: Resolved."
    doc = parser.parse(raw_text.encode("utf-8"), "log.txt")
    
    assert doc.document_type == "txt"
    assert doc.extraction_status == "success"
    assert doc.row_count == 6
    assert len(doc.sections) == 2
    assert doc.sections[0].title == "Executive Summary"


def test_csv_parser():
    parser = CSVParser()
    csv_bytes = create_synthetic_csv()
    doc = parser.parse(csv_bytes, "alerts_export.csv")
    
    assert doc.document_type == "csv"
    assert doc.extraction_status == "success"
    assert doc.row_count == 3
    assert doc.column_count == 5
    assert len(doc.tables) == 1
    assert "rule_name" in doc.tables[0].headers


def test_csv_parser_semicolon_delimiter():
    parser = CSVParser()
    csv_content = "alert_id;rule_name;severity\nALT-1;Malware;High\nALT-2;Phish;Low"
    doc = parser.parse(csv_content.encode("utf-8"), "alerts_semi.csv")
    
    assert doc.document_type == "csv"
    assert doc.extraction_status == "success"
    assert doc.row_count == 2
    assert "rule_name" in doc.tables[0].headers


def test_json_parser_array():
    parser = JSONParser()
    json_bytes = create_synthetic_json()
    doc = parser.parse(json_bytes, "cases.json")
    
    assert doc.document_type == "json"
    assert doc.extraction_status == "success"
    assert doc.row_count == 2
    assert len(doc.tables) == 1
    assert "case_id" in doc.tables[0].headers
    assert "CVE-2024-21413" in doc.extracted_text


def test_excel_parser():
    parser = ExcelParser()
    xlsx_bytes = create_synthetic_xlsx()
    doc = parser.parse(xlsx_bytes, "soc_metrics.xlsx")
    
    assert doc.document_type == "xlsx"
    assert doc.extraction_status == "success"
    assert doc.sheet_names == ["Alerts", "Performance"]
    assert len(doc.tables) == 2
    assert doc.tables[0].name == "Sheet: Alerts"
    assert doc.tables[1].name == "Sheet: Performance"


def test_malformed_json_parser():
    parser = JSONParser()
    malformed = b"{ invalid json content: [ "
    doc = parser.parse(malformed, "broken.json")
    
    assert doc.extraction_status == "failed"
    assert "Invalid JSON" in doc.error_message
