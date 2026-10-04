from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ExtractedDateItem(BaseModel):
    value: str
    context: Optional[str] = None
    source_location: Optional[str] = None


class ExtractedEntityItem(BaseModel):
    name: str
    category: Optional[str] = "organization"
    frequency: int = 1
    source_location: Optional[str] = None


class ExtractedIdentifierItem(BaseModel):
    type: str  # e.g., "incident_id", "cve", "ip_address", "case_id", "generic_ref"
    value: str
    context: Optional[str] = None
    source_location: Optional[str] = None


class ExtractedKeyValueItem(BaseModel):
    label: str
    value: str
    unit: Optional[str] = None
    context: Optional[str] = None
    source_location: Optional[str] = None


class ExtractedHeadingItem(BaseModel):
    title: str
    level: int = 1
    source_location: Optional[str] = None


class ExtractedTermItem(BaseModel):
    term: str
    frequency: int


class ExtractedTableSummaryItem(BaseModel):
    name: Optional[str] = "Table"
    row_count: int
    column_count: int
    headers: List[str] = []
    sample_rows: List[Dict[str, Any]] = []
    source_location: Optional[str] = None


class DocumentOverview(BaseModel):
    filename: str
    document_type: str
    detected_category: str = "unknown"
    estimated_size_bytes: Optional[int] = None
    page_count: Optional[int] = None
    section_count: Optional[int] = None
    sheet_count: Optional[int] = None
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    extraction_quality: str = "good"  # "high", "good", "fair", "low", "ocr_required", "failed"
    summary: Optional[str] = None


class ExtractedInformation(BaseModel):
    dates: List[ExtractedDateItem] = []
    organizations: List[ExtractedEntityItem] = []
    identifiers: List[ExtractedIdentifierItem] = []
    key_values: List[ExtractedKeyValueItem] = []
    headings: List[ExtractedHeadingItem] = []
    repeated_terms: List[ExtractedTermItem] = []
    tables: List[ExtractedTableSummaryItem] = []


class QualityCheck(BaseModel):
    check_id: str
    check_name: str
    category: str = "completeness"  # "completeness", "consistency", "validity", "structure", "uniqueness"
    status: str = "passed"  # "passed", "warning", "failed"
    message: str
    details: Optional[Dict[str, Any]] = None


class Finding(BaseModel):
    finding_id: str
    title: str
    category: str = "data_quality"  # "data_quality", "structural", "soc_observation", "security_compliance", "anomaly", "validation"
    severity: str = "info"  # "critical", "high", "medium", "low", "info"
    finding_type: str = "observation"  # "warning", "confirmed_error", "human_review_required", "observation"
    description: str
    reason: str
    evidence: Optional[str] = None
    source_location: Optional[str] = None
    recommended_action: Optional[str] = None


class Limitation(BaseModel):
    limitation_id: str
    title: str
    category: str = "validation_scope"  # "extraction", "parsing", "schema", "validation_scope", "security"
    description: str
    impact: str
    recommended_workaround: Optional[str] = None


class DocumentAnalysisResponse(BaseModel):
    id: Optional[str] = None
    document_id: str
    status: str
    analysis_version: int = 1
    document_overview: DocumentOverview
    extracted_information: ExtractedInformation
    quality_checks: List[QualityCheck] = []
    findings: List[Finding] = []
    limitations: List[Limitation] = []
    created_at: datetime

    model_config = {"from_attributes": True}
