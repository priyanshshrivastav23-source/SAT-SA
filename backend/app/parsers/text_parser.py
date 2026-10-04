import re
from pathlib import Path
from typing import Union
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedSection


class TextParser(BaseParser):
    def _decode_bytes(self, raw_bytes: bytes) -> str:
        """Attempt multi-encoding decode."""
        encodings = ["utf-8-sig", "utf-8", "latin-1", "cp1252", "utf-16"]
        for enc in encodings:
            try:
                return raw_bytes.decode(enc)
            except (UnicodeDecodeError, LookupError):
                continue
        return raw_bytes.decode("utf-8", errors="replace")

    def parse(self, file_path_or_bytes: Union[str, Path, bytes], filename: str) -> NormalizedDocument:
        norm_doc = NormalizedDocument(
            document_type="txt",
            extraction_status="success",
        )
        try:
            if isinstance(file_path_or_bytes, bytes):
                text = self._decode_bytes(file_path_or_bytes)
            else:
                raw = Path(file_path_or_bytes).read_bytes()
                text = self._decode_bytes(raw)

            norm_doc.extracted_text = text
            lines = text.splitlines()
            norm_doc.row_count = len(lines)

            # Heuristic section extraction
            sections = []
            for idx, line in enumerate(lines):
                trimmed = line.strip()
                if not trimmed:
                    continue
                
                # Markdown style headings
                if trimmed.startswith("#"):
                    match = re.match(r"^(#+)\s*(.+)", trimmed)
                    if match:
                        level = len(match.group(1))
                        sections.append(
                            ExtractedSection(
                                title=match.group(2).strip(),
                                level=min(level, 3),
                                line_number=idx + 1,
                                content=trimmed,
                            )
                        )
                # Uppercase short line headings
                elif len(trimmed) < 60 and trimmed.isupper() and len(trimmed) > 3:
                    sections.append(
                        ExtractedSection(
                            title=trimmed,
                            level=1,
                            line_number=idx + 1,
                            content=trimmed,
                        )
                    )
                # Section / Chapter headers
                elif re.match(r"^(Section|Chapter|Part|Appendix)\s+\d+.*", trimmed, re.IGNORECASE):
                    sections.append(
                        ExtractedSection(
                            title=trimmed,
                            level=1,
                            line_number=idx + 1,
                            content=trimmed,
                        )
                    )

            norm_doc.sections = sections[:50]

            if not text.strip():
                norm_doc.extraction_status = "partial"
                norm_doc.warnings.append("Text document is empty.")

        except Exception as e:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Failed to parse text document: {str(e)}"
            norm_doc.warnings.append("Text file parsing encountered an error.")

        return norm_doc
