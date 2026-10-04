import io
from pathlib import Path
from typing import Union
import fitz  # PyMuPDF
from app.core.config import settings
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedSection, ExtractedTable


class PDFParser(BaseParser):
    def parse(self, file_path_or_bytes: Union[str, Path, bytes], filename: str) -> NormalizedDocument:
        norm_doc = NormalizedDocument(
            document_type="pdf",
            extraction_status="success",
        )
        doc = None
        try:
            if isinstance(file_path_or_bytes, bytes):
                doc = fitz.open(stream=file_path_or_bytes, filetype="pdf")
            else:
                doc = fitz.open(str(file_path_or_bytes))

            if doc.is_encrypted:
                if not doc.authenticate(""):
                    norm_doc.extraction_status = "failed"
                    norm_doc.error_message = "PDF is encrypted/password-protected and cannot be parsed without password."
                    norm_doc.warnings.append("Encrypted document: password required.")
                    return norm_doc

            page_count = len(doc)
            norm_doc.page_count = page_count
            norm_doc.raw_metadata = doc.metadata or {}

            if page_count == 0:
                norm_doc.extraction_status = "failed"
                norm_doc.error_message = "PDF contains 0 pages."
                norm_doc.warnings.append("Document has no pages.")
                return norm_doc

            full_text_parts = []
            total_chars = 0
            has_images = False
            sections = []
            tables = []

            for page_num in range(page_count):
                page = doc[page_num]
                page_display_num = page_num + 1
                
                # Check for images
                images = page.get_images()
                if images:
                    has_images = True

                # Extract text blocks
                page_text = page.get_text("text") or ""
                trimmed_page_text = page_text.strip()
                total_chars += len(trimmed_page_text)

                if trimmed_page_text:
                    full_text_parts.append(f"--- [Page {page_display_num}] ---\n{trimmed_page_text}")
                
                # Try table extraction
                try:
                    tabs = page.find_tables()
                    for idx, tab in enumerate(tabs.tables):
                        df = tab.extract()
                        if df and len(df) > 1:
                            headers = [str(col).strip() if col is not None else f"Col_{i}" for i, col in enumerate(df[0])]
                            rows = []
                            for r in df[1:settings.MAX_TABLE_PREVIEW_ROWS + 1]:
                                row_dict = {}
                                for i, h in enumerate(headers):
                                    val = r[i] if i < len(r) else ""
                                    row_dict[h] = str(val).strip() if val is not None else ""
                                rows.append(row_dict)
                            
                            tables.append(
                                ExtractedTable(
                                    name=f"Page {page_display_num} Table {idx + 1}",
                                    page_number=page_display_num,
                                    row_count=len(df) - 1,
                                    column_count=len(headers),
                                    headers=headers,
                                    rows=rows,
                                )
                            )
                except Exception:
                    # Ignore table extraction failure on complex layouts
                    pass

                # Extract potential headings from text blocks
                blocks = page.get_text("blocks")
                for b in blocks:
                    # block format: (x0, y0, x1, y1, text, block_no, block_type)
                    if len(b) >= 5:
                        b_text = str(b[4]).strip()
                        lines = b_text.splitlines()
                        if lines:
                            first_line = lines[0].strip()
                            # Heuristic for headings: short line, uppercase or title-like
                            if 3 <= len(first_line) <= 80 and not first_line.endswith("."):
                                if first_line.isupper() or any(first_line.startswith(prefix) for prefix in ["Section", "Chapter", "1.", "2.", "3.", "4.", "5.", "Appendix", "Table"]):
                                    sections.append(
                                        ExtractedSection(
                                            title=first_line,
                                            level=1 if first_line.isupper() else 2,
                                            page_number=page_display_num,
                                            content=b_text[:500],
                                        )
                                    )

            norm_doc.extracted_text = "\n\n".join(full_text_parts)
            norm_doc.sections = sections[:50]  # Limit to top 50 detected sections
            norm_doc.tables = tables

            # Check OCR requirement
            avg_chars_per_page = total_chars / max(page_count, 1)
            if avg_chars_per_page < settings.PDF_OCR_CHAR_THRESHOLD_PER_PAGE:
                if has_images or total_chars < 50:
                    norm_doc.extraction_status = "ocr_required"
                    norm_doc.warnings.append(
                        f"Scanned or image-based PDF detected (low text density: ~{int(avg_chars_per_page)} chars/page). "
                        "Text extraction yielded minimal content. OCR processing is required for complete analysis."
                    )
                else:
                    norm_doc.extraction_status = "partial"
                    norm_doc.warnings.append("Low text density detected in document.")

        except Exception as e:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Failed to parse PDF document: {str(e)}"
            norm_doc.warnings.append("PDF parsing encountered an unrecoverable error.")
        finally:
            if doc is not None:
                doc.close()

        return norm_doc
