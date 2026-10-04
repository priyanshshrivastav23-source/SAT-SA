# SAT-SA Document Analysis MVP (SIH26157)
## Supervisory Analytics Tool for SOC Assessment

A modular, offline-first backend MVP for ingesting, extracting, and analyzing multi-format supervisory documents (PDF, DOCX, CSV, JSON, XLSX, TXT) for cybersecurity examiners and SOC auditors.

---

## 🚀 Key Features

- **Multi-Format Ingestion**: Supports `.pdf`, `.docx`, `.txt`, `.csv`, `.json`, and `.xlsx` with format validation, MIME sniffing, magic byte verification, and SHA-256 integrity hashing.
- **Intelligent Parsers**:
  - **PDF Parser (`PyMuPDF`)**: Page-by-page text, table extraction, and automatic raster/scanned document detection flagging OCR requirement.
  - **DOCX Parser (`python-docx`)**: Headings hierarchy, paragraphs, and table extraction.
  - **CSV / Excel Parsers (`pandas`, `openpyxl`)**: Automatic delimiter sniffing, multi-sheet workbook parsing, preview generation, and formula error detection.
  - **JSON Parser**: Supports both flat/nested records and arrays of event objects.
  - **Plain Text Parser**: Multi-encoding fallback (UTF-8, UTF-16, Latin-1, CP1252) and section detection.
- **Rule-Based Generic Document Analysis**:
  - **Document Overview**: Concise extractive summaries, size metrics, and extraction quality scoring.
  - **Key Information Extraction**: Dates & reporting periods, organization names, security identifiers (`INC-*`, `CVE-*`, `IPs`, hashes), and numerical metrics (SLAs, MTTR, percentages).
  - **Data Quality Checks**: Emptiness checks, duplicate rows, missing value density, header integrity, and date consistency.
  - **Explainable Findings**: Structured observations containing severity, category, evidence snippet, source location (page/sheet/row), and recommended actions.
  - **Explicit Limitations**: Clear statements regarding OCR requirements, preview sampling, and non-tamper bounds.
- **SOC Classification Heuristics**: Transparent scoring classifying documents into:
  - `soc_performance_report`
  - `alert_incident_export`
  - `investigation_report`
  - `case_closure_report`
  - `escalation_report`
  - `asset_inventory`
  - `sla_report`
  - `general_document`
- **Future SOC Engine Interfaces**: Clean integration points prepared for `ExecutionGapEngine`, `NegativeSpaceEngine`, `PeerBenchmarkingEngine`, `GoodhartLens`, `EvidenceFusion`, and `ReviewPlanner`.
- **Offline-First & Secure**: Runs completely locally with SQLite; no external LLM or cloud API dependencies required.

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py             # Health check endpoint
│   │   │   └── documents.py          # Upload, analyze, list, get endpoints
│   │   └── router.py                 # Root API router
│   ├── core/
│   │   └── config.py                 # Settings (Pydantic BaseSettings)
│   ├── db/
│   │   ├── base.py                   # SQLAlchemy Base
│   │   └── session.py                # Database session & engine
│   ├── models/
│   │   ├── document.py               # Document metadata model
│   │   └── analysis.py               # DocumentAnalysis report model
│   ├── parsers/
│   │   ├── base.py                   # BaseParser & NormalizedDocument
│   │   ├── pdf_parser.py             # PyMuPDF parser with OCR detection
│   │   ├── docx_parser.py            # DOCX parser with table extraction
│   │   ├── text_parser.py            # Multi-encoding text parser
│   │   ├── csv_parser.py             # CSV sniffer & pandas parser
│   │   ├── json_parser.py            # JSON structured parser
│   │   └── excel_parser.py           # Multi-sheet Excel parser
│   ├── schemas/
│   │   ├── document.py               # Document request/response schemas
│   │   └── analysis.py               # Analysis JSON schemas
│   ├── services/
│   │   ├── storage_service.py        # Local storage & path safety
│   │   ├── extraction_service.py     # Parser orchestration
│   │   ├── soc_classification_service.py # SOC Heuristic classification
│   │   ├── quality_service.py        # Data quality checks & findings
│   │   └── document_analysis_service.py # Core analysis pipeline
│   ├── soc_modules/
│   │   └── interfaces.py             # Future SOC engine interfaces
│   ├── utils/
│   │   └── file_validation.py        # Extension, MIME, Magic bytes, SHA-256
│   └── main.py                       # FastAPI application & CORS
├── storage/
│   ├── uploads/                      # Raw uploaded files
│   └── extracted/                    # Stored normalized JSON
├── tests/
│   ├── conftest.py                   # Pytest fixtures & synthetic doc generators
│   ├── test_health.py                # Health route tests
│   ├── test_parsers.py               # All 6 document parsers tests
│   ├── test_quality_and_soc.py       # Quality checks & SOC heuristics tests
│   └── test_documents_api.py         # Full API integration tests
├── .env.example
├── .gitignore
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Pip

### 2. Create Virtual Environment & Install Dependencies
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` if customization is needed:
```bash
cp .env.example .env
```

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Interactive API documentation will be available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Running Automated Tests

Run the full test suite with `pytest`:
```bash
pytest -v
```

---

## 📡 REST API Reference

### 1. Health Check
`GET /api/health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "SAT-SA Document Analysis MVP",
  "version": "1.0.0",
  "database": "healthy",
  "storage": {
    "upload_dir_exists": true,
    "extracted_dir_exists": true,
    "storage_writable": true
  },
  "supported_parsers": ["pdf", "docx", "txt", "csv", "json", "xlsx"],
  "offline_mode": true
}
```

---

### 2. Upload Document
`POST /api/documents/upload`
- **Content-Type**: `multipart/form-data`
- **Form Param**: `file` (Binary file)
- **Response** (`201 Created`):
```json
{
  "document_id": "doc_a1b2c3d4e5f6",
  "filename": "q1_soc_performance_report.pdf",
  "file_type": "pdf",
  "status": "completed",
  "extraction_status": "success",
  "detected_category": "soc_performance_report",
  "message": "Document uploaded and analyzed successfully.",
  "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "file_size": 245120,
  "upload_timestamp": "2026-10-04T22:30:00Z"
}
```

---

### 3. List Documents
`GET /api/documents?page=1&page_size=10&file_type=pdf&status=completed`
- **Query Params**:
  - `page` (int, default: 1)
  - `page_size` (int, default: 10, max: 100)
  - `file_type` (optional: pdf, docx, txt, csv, json, xlsx)
  - `status` (optional: processing, completed, failed)
  - `category` (optional: soc_performance_report, alert_incident_export, etc.)
  - `search` (optional: filename substring)

---

### 4. Get Document Metadata
`GET /api/documents/{document_id}`
- **Response**:
```json
{
  "id": "doc_a1b2c3d4e5f6",
  "original_filename": "q1_soc_performance_report.pdf",
  "stored_filename": "9b1deb4d3b7d4b6da38c.pdf",
  "file_type": "pdf",
  "mime_type": "application/pdf",
  "file_size": 245120,
  "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "upload_timestamp": "2026-10-04T22:30:00Z",
  "processing_status": "completed",
  "extraction_status": "success",
  "detected_category": "soc_performance_report",
  "latest_analysis_version": 1
}
```

---

### 5. Get Document Analysis Report
`GET /api/documents/{document_id}/analysis`
- **Query Param**: `version` (optional int)
- **Response Structure**:
```json
{
  "document_id": "doc_a1b2c3d4e5f6",
  "status": "completed",
  "analysis_version": 1,
  "document_overview": {
    "filename": "q1_soc_performance_report.pdf",
    "document_type": "pdf",
    "detected_category": "soc_performance_report",
    "estimated_size_bytes": 245120,
    "page_count": 5,
    "section_count": 8,
    "extraction_quality": "high",
    "summary": "Analyzed 'q1_soc_performance_report.pdf' (format: PDF) as a 'Soc Performance Report'. Document scope encompasses 5 page(s), 8 section heading(s). Extracted 12 date reference(s); 6 identifier(s); 2 structured table(s). Rule-based analysis flagged 3 observation(s)."
  },
  "extracted_information": {
    "dates": [
      {
        "value": "2026-03-15",
        "context": "...incident occurred on 2026-03-15 during shift...",
        "source_location": "q1_soc_performance_report.pdf"
      }
    ],
    "organizations": [
      {
        "name": "Global Cyber Defense Corp",
        "category": "organization",
        "frequency": 4,
        "source_location": "q1_soc_performance_report.pdf"
      }
    ],
    "identifiers": [
      {
        "type": "incident_identifier",
        "value": "INC-9901",
        "context": "...escalated ticket INC-9901 to tier 2...",
        "source_location": "q1_soc_performance_report.pdf"
      },
      {
        "type": "cve_vulnerability",
        "value": "CVE-2024-21413",
        "context": "...exploited Microsoft Outlook vulnerability CVE-2024-21413...",
        "source_location": "q1_soc_performance_report.pdf"
      }
    ],
    "key_values": [
      {
        "label": "Percentage / Rate",
        "value": "99.2%",
        "context": "...overall SLA compliance was 99.2% for Q1...",
        "source_location": "q1_soc_performance_report.pdf"
      }
    ],
    "headings": [
      {
        "title": "Executive Summary",
        "level": 1,
        "source_location": "Page 1"
      }
    ],
    "repeated_terms": [
      { "term": "alerts", "frequency": 42 },
      { "term": "containment", "frequency": 18 }
    ],
    "tables": [
      {
        "name": "Page 3 Table 1",
        "row_count": 12,
        "column_count": 4,
        "headers": ["Analyst", "Shift", "Tickets Closed", "MTTR (mins)"],
        "sample_rows": [
          { "Analyst": "Alice", "Shift": "Day", "Tickets Closed": "45", "MTTR (mins)": "28" }
        ],
        "source_location": "Page 3"
      }
    ]
  },
  "quality_checks": [
    {
      "check_id": "QC-001",
      "check_name": "Document Content Completeness",
      "category": "completeness",
      "status": "passed",
      "message": "Document contains sufficient extractable content."
    },
    {
      "check_id": "QC-005",
      "check_name": "Date Format Consistency",
      "category": "consistency",
      "status": "passed",
      "message": "Date formats appear consistent across the document."
    }
  ],
  "findings": [
    {
      "finding_id": "FIND-001",
      "title": "Security Vulnerability References (1 CVEs)",
      "category": "security_compliance",
      "severity": "medium",
      "finding_type": "observation",
      "description": "Document explicitly references 1 common vulnerability identifiers (CVEs).",
      "reason": "Detected CVE regex patterns.",
      "evidence": "CVEs: CVE-2024-21413",
      "source_location": "q1_soc_performance_report.pdf",
      "recommended_action": "Cross-reference CVE list against current patch and threat intelligence databases."
    }
  ],
  "limitations": [
    {
      "limitation_id": "LIM-001",
      "title": "Non-Tamper & Authenticity Limitation",
      "category": "validation_scope",
      "description": "Parsing and extraction success does not verify the legal authenticity, cryptographical provenance, or absence of post-facto tampering of the uploaded document.",
      "impact": "Document contents should be validated against primary system-of-record log streams.",
      "recommended_workaround": "Verify digital signatures or cross-reference SHA-256 with origin archives."
    }
  ],
  "created_at": "2026-10-04T22:30:05Z"
}
```

---

### 6. Re-Analyze Document
`POST /api/documents/{document_id}/analyze`
- Triggers re-analysis on a previously uploaded document, increments `analysis_version` (e.g. v2), and returns the new analysis response.

---

### 7. Get Document Extracted Content
`GET /api/documents/{document_id}/content`
- Returns raw extracted text preview, total character count, sheet names, and table counts.

---

### 8. Delete Document
`DELETE /api/documents/{document_id}`
- Removes document record from database and cleans up local raw storage files.
