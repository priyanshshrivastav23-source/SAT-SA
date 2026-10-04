from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str
    status: str
    extraction_status: str
    detected_category: str
    message: str
    sha256_hash: str
    file_size: int
    upload_timestamp: datetime


class DocumentResponse(BaseModel):
    id: str
    original_filename: str
    stored_filename: str
    file_type: str
    mime_type: str
    file_size: int
    sha256_hash: str
    upload_timestamp: datetime
    processing_status: str
    extraction_status: str
    detected_category: str
    error_message: Optional[str] = None
    latest_analysis_version: Optional[int] = None

    model_config = {"from_attributes": True}


class DocumentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    documents: List[DocumentResponse]


class DocumentContentResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str
    extraction_status: str
    extracted_text_preview: str
    total_characters: int
    page_count: Optional[int] = None
    sheet_names: Optional[List[str]] = None
    tables_count: int = 0
    warnings: List[str] = []
