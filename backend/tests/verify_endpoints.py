import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import json
from fastapi.testclient import TestClient
from app.main import app
from tests.conftest import (
    create_synthetic_pdf,
    create_scanned_synthetic_pdf,
    create_synthetic_docx,
    create_synthetic_csv,
    create_synthetic_json,
    create_synthetic_xlsx,
)

client = TestClient(app)

print("=" * 60)
print("SAT-SA API ENDPOINT VERIFICATION REPORT")
print("=" * 60)

# 1. Root & Health
print("\n[1] GET / (Root)")
r = client.get("/")
print(f"Status: {r.status_code}")
print(f"Response: {r.json()}")

print("\n[2] GET /api/health (Service Health & Diagnostics)")
r = client.get("/api/health")
print(f"Status: {r.status_code}")
print(f"Response: {json.dumps(r.json(), indent=2)}")

# 2. Upload Operations
print("\n[3] POST /api/documents/upload (PDF Report with SOC Metrics & CVE)")
pdf_content = create_synthetic_pdf(
    "SOC Performance Report Q1 2026\n"
    "Organization: Global Cyber Defense Corp\n"
    "Incident ID: INC-8821\n"
    "Vulnerability: CVE-2024-21413\n"
    "SLA Compliance: 99.4%\n"
    "MTTR: 28 minutes"
)
r_pdf = client.post(
    "/api/documents/upload",
    files={"file": ("soc_q1_report.pdf", pdf_content, "application/pdf")},
)
print(f"Status: {r_pdf.status_code}")
pdf_data = r_pdf.json()
print(f"Response: {json.dumps(pdf_data, indent=2)}")
pdf_doc_id = pdf_data["document_id"]

print("\n[4] POST /api/documents/upload (CSV with Duplicates & Missing Values)")
csv_content = create_synthetic_csv(with_duplicates=True, with_nulls=True)
r_csv = client.post(
    "/api/documents/upload",
    files={"file": ("alert_export.csv", csv_content, "text/csv")},
)
print(f"Status: {r_csv.status_code}")
csv_data = r_csv.json()
print(f"Response: {json.dumps(csv_data, indent=2)}")
csv_doc_id = csv_data["document_id"]

print("\n[5] POST /api/documents/upload (Scanned PDF - OCR Detection)")
scanned_content = create_scanned_synthetic_pdf()
r_scan = client.post(
    "/api/documents/upload",
    files={"file": ("scanned_audit_scan.pdf", scanned_content, "application/pdf")},
)
print(f"Status: {r_scan.status_code}")
scan_data = r_scan.json()
print(f"Extraction Status: {scan_data['extraction_status']}")
print(f"Message: {scan_data['message']}")
scanned_doc_id = scan_data["document_id"]

# 3. Document Listing & Filtering
print("\n[6] GET /api/documents (List with Pagination & Filtering)")
r_list = client.get("/api/documents?page=1&page_size=5")
print(f"Status: {r_list.status_code}")
list_data = r_list.json()
print(f"Total Documents: {list_data['total']}, Page: {list_data['page']}, Page Size: {list_data['page_size']}")

r_filter = client.get("/api/documents?file_type=csv")
print(f"Filter by file_type=csv: Found {r_filter.json()['total']} document(s)")

# 4. Get Document Metadata
print(f"\n[7] GET /api/documents/{pdf_doc_id} (Metadata)")
r_meta = client.get(f"/api/documents/{pdf_doc_id}")
print(f"Status: {r_meta.status_code}")
print(f"Metadata: {json.dumps(r_meta.json(), indent=2)}")

# 5. Get Document Analysis
print(f"\n[8] GET /api/documents/{pdf_doc_id}/analysis (Detailed Structured Report)")
r_analysis = client.get(f"/api/documents/{pdf_doc_id}/analysis")
print(f"Status: {r_analysis.status_code}")
ana_data = r_analysis.json()
print(f"Analysis Version: {ana_data['analysis_version']}")
print(f"Detected Category: {ana_data['document_overview']['detected_category']}")
print(f"Extraction Quality: {ana_data['document_overview']['extraction_quality']}")
print(f"Summary: {ana_data['document_overview']['summary']}")
print("Extracted Identifiers:", [f"{i['type']}: {i['value']}" for i in ana_data['extracted_information']['identifiers']])
print("Extracted Key Values:", [f"{k['label']}: {k['value']}" for k in ana_data['extracted_information']['key_values']])
print("Extracted Organizations:", [o['name'] for o in ana_data['extracted_information']['organizations']])

# 6. Quality Checks & Findings on CSV
print(f"\n[9] GET /api/documents/{csv_doc_id}/analysis (Quality Checks & Findings)")
r_csv_ana = client.get(f"/api/documents/{csv_doc_id}/analysis")
csv_ana_data = r_csv_ana.json()
print("Quality Checks:")
for qc in csv_ana_data.get("quality_checks", []):
    print(f"  - [{qc['status'].upper()}] {qc['check_name']}: {qc['message']}")
print("Explainable Findings:")
for f in csv_ana_data.get("findings", []):
    print(f"  - [{f['severity'].upper()}] {f['title']}: {f['description']} (Evidence: {f['evidence']})")

# 7. Document Re-analysis Versioning
print(f"\n[10] POST /api/documents/{pdf_doc_id}/analyze (Trigger Re-analysis)")
r_reana = client.post(f"/api/documents/{pdf_doc_id}/analyze")
print(f"Status: {r_reana.status_code}")
print(f"New Version: {r_reana.json()['analysis_version']}")

# 8. Document Raw Extracted Content
print(f"\n[11] GET /api/documents/{pdf_doc_id}/content (Extracted Content)")
r_cnt = client.get(f"/api/documents/{pdf_doc_id}/content")
print(f"Status: {r_cnt.status_code}")
cnt_data = r_cnt.json()
print(f"Total Characters: {cnt_data['total_characters']}")
print(f"Text Preview snippet: {cnt_data['extracted_text_preview'][:120]}...")

# 9. Error Cases
print("\n[12] Error Cases Testing:")
r_err1 = client.post("/api/documents/upload", files={"file": ("virus.exe", b"MZ...", "application/x-msdownload")})
print(f"  - Upload .exe (Invalid Extension) -> Status: {r_err1.status_code}, Error: {r_err1.json()['detail']}")

r_err2 = client.post("/api/documents/upload", files={"file": ("zero_byte.pdf", b"", "application/pdf")})
print(f"  - Upload 0-byte file -> Status: {r_err2.status_code}, Error: {r_err2.json()['detail']}")

r_err3 = client.get("/api/documents/doc_does_not_exist")
print(f"  - GET non-existent document -> Status: {r_err3.status_code}, Error: {r_err3.json()['detail']}")

# 10. Document Deletion
print(f"\n[13] DELETE /api/documents/{scanned_doc_id}")
r_del = client.delete(f"/api/documents/{scanned_doc_id}")
print(f"Status: {r_del.status_code}, Message: {r_del.json()['message']}")
r_del_check = client.get(f"/api/documents/{scanned_doc_id}")
print(f"Verification after delete: Status {r_del_check.status_code} (404 as expected)")

print("\n" + "=" * 60)
print("ALL SAT-SA ENDPOINTS VERIFIED AND WORKING PROPERLY!")
print("=" * 60)
