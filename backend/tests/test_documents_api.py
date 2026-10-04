import io
import pytest
from tests.conftest import (
    create_synthetic_pdf,
    create_synthetic_docx,
    create_synthetic_csv,
    create_synthetic_json,
    create_synthetic_xlsx,
)


def test_upload_pdf_success(client):
    pdf_bytes = create_synthetic_pdf("SOC Audit Report\nDate: 2026-03-20\nOrganization: Cyber Defense Corp")
    response = client.post(
        "/api/documents/upload",
        files={"file": ("audit_report.pdf", pdf_bytes, "application/pdf")},
    )
    assert response.status_code == 201
    data = response.json()
    assert "document_id" in data
    assert data["filename"] == "audit_report.pdf"
    assert data["file_type"] == "pdf"
    assert data["status"] == "completed"
    assert "sha256_hash" in data


def test_upload_csv_success(client):
    csv_bytes = create_synthetic_csv()
    response = client.post(
        "/api/documents/upload",
        files={"file": ("alerts.csv", csv_bytes, "text/csv")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["file_type"] == "csv"
    assert data["status"] == "completed"


def test_upload_docx_success(client):
    docx_bytes = create_synthetic_docx()
    response = client.post(
        "/api/documents/upload",
        files={"file": ("closure.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["file_type"] == "docx"
    assert data["status"] == "completed"


def test_upload_json_success(client):
    json_bytes = create_synthetic_json()
    response = client.post(
        "/api/documents/upload",
        files={"file": ("cases.json", json_bytes, "application/json")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["file_type"] == "json"
    assert data["status"] == "completed"


def test_upload_xlsx_success(client):
    xlsx_bytes = create_synthetic_xlsx()
    response = client.post(
        "/api/documents/upload",
        files={"file": ("metrics.xlsx", xlsx_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["file_type"] == "xlsx"
    assert data["status"] == "completed"


def test_upload_invalid_extension(client):
    response = client.post(
        "/api/documents/upload",
        files={"file": ("malware.exe", b"MZ\x90\x00\x03\x00\x00\x00", "application/x-msdownload")},
    )
    assert response.status_code == 415
    assert "Unsupported file type" in response.json()["detail"]


def test_upload_empty_file(client):
    response = client.post(
        "/api/documents/upload",
        files={"file": ("empty.txt", b"", "text/plain")},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_get_document_metadata_and_analysis(client):
    pdf_bytes = create_synthetic_pdf("Incident Response Briefing\nID: INC-7700\nSLA: 99.2% met")
    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("incident_brief.pdf", pdf_bytes, "application/pdf")},
    )
    doc_id = upload_res.json()["document_id"]

    # 1. Get Metadata
    meta_res = client.get(f"/api/documents/{doc_id}")
    assert meta_res.status_code == 200
    meta = meta_res.json()
    assert meta["id"] == doc_id
    assert meta["original_filename"] == "incident_brief.pdf"
    assert meta["processing_status"] == "completed"

    # 2. Get Analysis Report
    analysis_res = client.get(f"/api/documents/{doc_id}/analysis")
    assert analysis_res.status_code == 200
    analysis = analysis_res.json()
    assert analysis["document_id"] == doc_id
    assert analysis["analysis_version"] == 1
    assert "document_overview" in analysis
    assert "extracted_information" in analysis
    assert "quality_checks" in analysis
    assert "findings" in analysis
    assert "limitations" in analysis


def test_document_reanalysis_versioning(client):
    csv_bytes = create_synthetic_csv()
    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("alerts_versioned.csv", csv_bytes, "text/csv")},
    )
    doc_id = upload_res.json()["document_id"]

    # Re-run analysis
    re_res = client.post(f"/api/documents/{doc_id}/analyze")
    assert re_res.status_code == 200
    re_data = re_res.json()
    assert re_data["analysis_version"] == 2

    # Fetch version 1 explicitly
    v1_res = client.get(f"/api/documents/{doc_id}/analysis?version=1")
    assert v1_res.status_code == 200
    assert v1_res.json()["analysis_version"] == 1

    # Fetch latest version (should default to 2)
    latest_res = client.get(f"/api/documents/{doc_id}/analysis")
    assert latest_res.status_code == 200
    assert latest_res.json()["analysis_version"] == 2


def test_get_document_content(client):
    txt_content = "Line 1: System Boot\nLine 2: Firewall started\nLine 3: SIEM Connected"
    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("syslog.txt", txt_content.encode("utf-8"), "text/plain")},
    )
    doc_id = upload_res.json()["document_id"]

    content_res = client.get(f"/api/documents/{doc_id}/content")
    assert content_res.status_code == 200
    data = content_res.json()
    assert data["document_id"] == doc_id
    assert "Firewall started" in data["extracted_text_preview"]
    assert data["total_characters"] > 0


def test_list_documents_pagination_and_filter(client):
    # Upload 2 docs
    client.post(
        "/api/documents/upload",
        files={"file": ("doc_a.txt", b"First test file content", "text/plain")},
    )
    client.post(
        "/api/documents/upload",
        files={"file": ("doc_b.csv", b"col1,col2\nval1,val2", "text/csv")},
    )

    # List all
    list_res = client.get("/api/documents?page=1&page_size=10")
    assert list_res.status_code == 200
    data = list_res.json()
    assert data["total"] >= 2
    assert len(data["documents"]) >= 2

    # Filter by file_type = csv
    csv_filter_res = client.get("/api/documents?file_type=csv")
    assert csv_filter_res.status_code == 200
    csv_data = csv_filter_res.json()
    assert all(d["file_type"] == "csv" for d in csv_data["documents"])


def test_delete_document(client):
    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("to_delete.txt", b"temporary data", "text/plain")},
    )
    doc_id = upload_res.json()["document_id"]

    del_res = client.delete(f"/api/documents/{doc_id}")
    assert del_res.status_code == 200

    # Verify not found
    get_res = client.get(f"/api/documents/{doc_id}")
    assert get_res.status_code == 404
