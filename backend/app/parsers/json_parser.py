import json
from pathlib import Path
from typing import Union, Dict, Any, List
from app.core.config import settings
from app.parsers.base import BaseParser, NormalizedDocument, ExtractedTable, ExtractedSection


class JSONParser(BaseParser):
    def _decode(self, raw_bytes: bytes) -> str:
        for enc in ["utf-8-sig", "utf-8", "latin-1"]:
            try:
                return raw_bytes.decode(enc)
            except Exception:
                continue
        return raw_bytes.decode("utf-8", errors="replace")

    def parse(self, file_path_or_bytes: Union[str, Path, bytes], filename: str) -> NormalizedDocument:
        norm_doc = NormalizedDocument(
            document_type="json",
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
                norm_doc.warnings.append("JSON file is empty.")
                return norm_doc

            data = json.loads(text_content)

            tables = []
            sections = []

            if isinstance(data, list):
                # Array of items (e.g. list of alert objects or events)
                total_records = len(data)
                norm_doc.row_count = total_records
                
                # Check if elements are dicts
                dict_elements = [item for item in data if isinstance(item, dict)]
                if dict_elements:
                    all_keys = []
                    seen_keys = set()
                    for item in dict_elements[:100]:
                        for k in item.keys():
                            if k not in seen_keys:
                                seen_keys.add(k)
                                all_keys.append(str(k))

                    norm_doc.column_count = len(all_keys)

                    sample_rows = []
                    for item in dict_elements[:settings.MAX_TABLE_PREVIEW_ROWS]:
                        row_dict = {}
                        for k in all_keys:
                            val = item.get(k, "")
                            if isinstance(val, (dict, list)):
                                row_dict[k] = json.dumps(val, ensure_ascii=False)[:200]
                            else:
                                row_dict[k] = str(val) if val is not None else ""
                        sample_rows.append(row_dict)

                    tables.append(
                        ExtractedTable(
                            name=f"JSON Array ({filename})",
                            row_count=total_records,
                            column_count=len(all_keys),
                            headers=all_keys,
                            rows=sample_rows,
                        )
                    )

                text_lines = [
                    f"JSON Array Dataset: {filename}",
                    f"Total Records: {total_records}",
                    f"Sample Preview: {json.dumps(data[:3], indent=2, default=str)}",
                ]
                norm_doc.extracted_text = "\n".join(text_lines)

            elif isinstance(data, dict):
                # Single JSON object or nested configuration/report
                norm_doc.column_count = len(data.keys())
                keys_list = list(data.keys())

                for k, v in data.items():
                    val_str = json.dumps(v, indent=2, default=str) if isinstance(v, (dict, list)) else str(v)
                    sections.append(
                        ExtractedSection(
                            title=f"Field: {k}",
                            level=1,
                            content=val_str[:500],
                        )
                    )

                    # If a field contains an array of objects, treat as an embedded table
                    if isinstance(v, list) and v and isinstance(v[0], dict):
                        sub_keys = list(v[0].keys())
                        sample_rows = []
                        for r in v[:settings.MAX_TABLE_PREVIEW_ROWS]:
                            sample_rows.append({sk: str(r.get(sk, "")) for sk in sub_keys})
                        tables.append(
                            ExtractedTable(
                                name=f"Embedded: {k}",
                                row_count=len(v),
                                column_count=len(sub_keys),
                                headers=sub_keys,
                                rows=sample_rows,
                            )
                        )

                norm_doc.sections = sections[:50]
                norm_doc.extracted_text = json.dumps(data, indent=2, default=str)

            else:
                norm_doc.extracted_text = str(data)

            norm_doc.tables = tables

        except json.JSONDecodeError as jde:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Invalid JSON syntax: line {jde.lineno}, column {jde.colno} ({jde.msg})"
            norm_doc.warnings.append("File contains malformed JSON and could not be decoded.")
        except Exception as e:
            norm_doc.extraction_status = "failed"
            norm_doc.error_message = f"Failed to parse JSON document: {str(e)}"
            norm_doc.warnings.append("JSON parsing encountered an error.")

        return norm_doc
