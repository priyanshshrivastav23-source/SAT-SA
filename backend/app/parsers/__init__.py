from typing import Dict, Type
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedSection, ExtractedTable
from app.parsers.pdf_parser import PDFParser
from app.parsers.docx_parser import DocxParser
from app.parsers.text_parser import TextParser
from app.parsers.csv_parser import CSVParser
from app.parsers.json_parser import JSONParser
from app.parsers.excel_parser import ExcelParser

PARSER_REGISTRY: Dict[str, Type[BaseParser]] = {
    "pdf": PDFParser,
    "docx": DocxParser,
    "txt": TextParser,
    "csv": CSVParser,
    "json": JSONParser,
    "xlsx": ExcelParser,
}


def get_parser(file_type: str) -> BaseParser:
    """Factory function to instantiate the appropriate document parser."""
    clean_type = file_type.lower().lstrip(".")
    parser_cls = PARSER_REGISTRY.get(clean_type)
    if not parser_cls:
        raise ValueError(f"No parser available for file type: '{file_type}'")
    return parser_cls()


__all__ = [
    "BaseParser",
    "NormalizedDocument",
    "ExtractedSection",
    "ExtractedTable",
    "PDFParser",
    "DocxParser",
    "TextParser",
    "CSVParser",
    "JSONParser",
    "ExcelParser",
    "PARSER_REGISTRY",
    "get_parser",
]
