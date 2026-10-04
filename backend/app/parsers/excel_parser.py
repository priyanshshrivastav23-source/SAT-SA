import io
from pathlib import Path
from typing import Union, List
import pandas as pd
from app.core.config import settings
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedTable


class ExcelParser(BaseParser):
    def parse(self, file_path_or_bytes: Union[str, Path, bytes], filename: str) -> NormalizedDocument:
        norm_doc = NormalizedDocument(
            document_type="xlsx",
            extraction_status="success",
        )
        try:
            if isinstance(file_path_or_bytes, bytes):
                file_source = io.BytesIO(file_path_or_bytes)
            else:
                file_source = str(file_path_or_bytes)

            excel_file = pd.ExcelFile(file_source, engine="openpyxl")
            sheet_names = excel_file.sheet_names
            norm_doc.sheet_names = sheet_names

            if not sheet_names:
                norm_doc.extraction_status = "partial"
                norm_doc.warnings.append("Excel workbook contains no sheets.")
                return norm_doc

            tables: List[ExtractedTable] = []
            total_rows_all_sheets = 0
            text_lines = [f"Excel Workbook: {filename}", f"Sheets ({len(sheet_names)}): {', '.join(sheet_names)}"]

            formula_error_tokens = ["#VALUE!", "#REF!", "#DIV/0!", "#NAME?", "#N/A", "#NUM!"]
            has_formula_errors = False

            for sheet_name in sheet_names:
                try:
                    df = pd.read_excel(
                        excel_file,
                        sheet_name=sheet_name,
                        dtype=str,
                        engine="openpyxl",
                    )
                except Exception as e:
                    norm_doc.warnings.append(f"Failed to read sheet '{sheet_name}': {str(e)}")
                    continue

                rows_count, cols_count = df.shape
                total_rows_all_sheets += rows_count

                if rows_count == 0:
                    norm_doc.warnings.append(f"Sheet '{sheet_name}' is empty.")
                    continue

                headers = [str(c).strip() for c in df.columns]
                df_clean = df.fillna("")

                # Check for formula errors
                for col in df_clean.columns:
                    col_vals = df_clean[col].astype(str)
                    if any(err in val for err in formula_error_tokens for val in col_vals[:50]):
                        has_formula_errors = True

                preview_df = df_clean.head(settings.MAX_TABLE_PREVIEW_ROWS)
                sample_rows = preview_df.to_dict(orient="records")

                tables.append(
                    ExtractedTable(
                        name=f"Sheet: {sheet_name}",
                        sheet_name=sheet_name,
                        row_count=rows_count,
                        column_count=cols_count,
                        headers=headers,
                        rows=sample_rows,
                    )
                )

                text_lines.append(f"\n--- Sheet: {sheet_name} (Rows: {rows_count}, Cols: {cols_count}) ---")
                text_lines.append(f"Columns: {', '.join(headers)}")
                for idx, r in enumerate(sample_rows[:5]):
                    row_str = " | ".join(f"{k}: {v}" for k, v in r.items() if v)
                    text_lines.append(f"  Row {idx + 1}: {row_str}")

            norm_doc.tables = tables
            norm_doc.row_count = total_rows_all_sheets
            norm_doc.extracted_text = "\n".join(text_lines)

            if has_formula_errors:
                norm_doc.warnings.append(
                    "Spreadsheet contains unsupported or unresolved formula errors (#VALUE!, #REF!, etc.)."
                )

            if total_rows_all_sheets == 0 and not tables:
                norm_doc.extraction_status = "partial"
                norm_doc.warnings.append("Workbook contains no data across all sheets.")

        except Exception as e:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Failed to parse Excel document: {str(e)}"
            norm_doc.warnings.append("Excel parsing encountered an unrecoverable error.")

        return norm_doc
