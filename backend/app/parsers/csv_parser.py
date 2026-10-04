import io
import csv
from pathlib import Path
from typing import Union
import pandas as pd
from app.core.config import settings
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedTable


class CSVParser(BaseParser):
    def _detect_delimiter(self, sample_text: str) -> str:
        """Detect separator (comma, semicolon, tab, pipe)."""
        try:
            sniffer = csv.Sniffer()
            dialect = sniffer.sniff(sample_text)
            return dialect.delimiter
        except Exception:
            for sep in [",", "\t", ";", "|"]:
                if sep in sample_text:
                    return sep
            return ","

    def _decode(self, raw_bytes: bytes) -> str:
        for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
            try:
                return raw_bytes.decode(enc)
            except Exception:
                continue
        return raw_bytes.decode("utf-8", errors="replace")

    def parse(self, file_path_or_bytes: Union[str, Path, bytes], filename: str) -> NormalizedDocument:
        norm_doc = NormalizedDocument(
            document_type="csv",
            extraction_status="success",
        )
        try:
            if isinstance(file_path_or_bytes, bytes):
                text_content = self._decode(file_path_or_bytes)
            else:
                raw_bytes = Path(file_path_or_bytes).read_bytes()
                text_content = self._decode(raw_bytes)

            if not text_content.strip():
                norm_doc.extraction_status = "partial"
                norm_doc.warnings.append("CSV document is empty.")
                return norm_doc

            sample = text_content[:4096]
            delimiter = self._detect_delimiter(sample)

            try:
                df = pd.read_csv(
                    io.StringIO(text_content),
                    sep=delimiter,
                    dtype=str,
                    on_bad_lines="skip",
                    engine="python",
                )
            except Exception as e:
                # Fallback to standard csv reader
                rows_raw = list(csv.reader(io.StringIO(text_content), delimiter=delimiter))
                if not rows_raw:
                    norm_doc.extraction_status = "partial"
                    norm_doc.warnings.append("Empty CSV content.")
                    return norm_doc
                headers = [str(h).strip() for h in rows_raw[0]]
                df = pd.DataFrame(rows_raw[1:], columns=headers)

            total_rows, total_cols = df.shape
            headers = [str(c).strip() for c in df.columns]

            norm_doc.row_count = total_rows
            norm_doc.column_count = total_cols

            # Fill NaN values with empty strings
            df_clean = df.fillna("")

            # Prepare sample rows for preview
            preview_df = df_clean.head(settings.MAX_TABLE_PREVIEW_ROWS)
            sample_rows = preview_df.to_dict(orient="records")

            table = ExtractedTable(
                name=f"Dataset ({filename})",
                row_count=total_rows,
                column_count=total_cols,
                headers=headers,
                rows=sample_rows,
            )
            norm_doc.tables = [table]

            # Text summary representation
            text_lines = [
                f"CSV Dataset: {filename}",
                f"Total Rows: {total_rows}, Total Columns: {total_cols}",
                f"Columns: {', '.join(headers)}",
                "\n--- Preview Data (first 10 rows) ---",
            ]
            for idx, r in enumerate(sample_rows[:10]):
                row_str = " | ".join(f"{k}: {v}" for k, v in r.items() if v)
                text_lines.append(f"Row {idx + 1}: {row_str}")

            norm_doc.extracted_text = "\n".join(text_lines)

            if total_rows == 0:
                norm_doc.warnings.append("CSV contains headers but has 0 data rows.")

        except Exception as e:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Failed to parse CSV document: {str(e)}"
            norm_doc.warnings.append("CSV parsing encountered an unrecoverable error.")

        return norm_doc
