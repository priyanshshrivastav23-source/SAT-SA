from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ExtractedSection(BaseModel):
    title: str
    level: int = 1
    page_number: Optional[int] = None
    sheet_name: Optional[str] = None
    line_number: Optional[int] = None
    content: str = ""


class ExtractedTable(BaseModel):
    name: Optional[str] = "Table"
    page_number: Optional[int] = None
    sheet_name: Optional[str] = None
    row_count: int = 0
    column_count: int = 0
    headers: List[str] = []
    rows: List[Dict[str, Any]] = []  # List of row dicts {col: val}
    raw_data: Optional[List[List[Any]]] = None


class NormalizedDocument(BaseModel):
    document_type: str
    extracted_text: str = ""
    page_count: Optional[int] = None
    sheet_names: Optional[List[str]] = None
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    sections: List[ExtractedSection] = []
    tables: List[ExtractedTable] = []
    raw_metadata: Dict[str, Any] = {}
    warnings: List[str] = []
    extraction_status: str = "success"  # "success", "partial", "ocr_required", "failed"
    error_message: Optional[str] = None


class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path_or_bytes: Any, filename: str) -> NormalizedDocument:
        """Parse file content and return a NormalizedDocument representation."""
        pass
