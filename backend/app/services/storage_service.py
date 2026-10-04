import json
from pathlib import Path
from typing import Any, Dict, Optional
from app.core.config import settings


class StorageService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        self.extracted_dir = settings.EXTRACTED_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.extracted_dir.mkdir(parents=True, exist_ok=True)

    def _resolve_safe_path(self, base_dir: Path, filename: str) -> Path:
        """Ensure file path is strictly within base_dir to avoid path traversal."""
        resolved = (base_dir / filename).resolve()
        if not str(resolved).startswith(str(base_dir.resolve())):
            raise ValueError(f"Path traversal detected: {filename}")
        return resolved

    def save_upload_file(self, stored_filename: str, content: bytes) -> Path:
        """Save uploaded raw bytes to the uploads directory."""
        target_path = self._resolve_safe_path(self.upload_dir, stored_filename)
        target_path.write_bytes(content)
        return target_path

    def get_upload_path(self, stored_filename: str) -> Path:
        """Get the full path to a stored uploaded file."""
        return self._resolve_safe_path(self.upload_dir, stored_filename)

    def read_upload_file(self, stored_filename: str) -> bytes:
        """Read raw bytes of a stored file."""
        path = self.get_upload_path(stored_filename)
        if not path.exists():
            raise FileNotFoundError(f"Stored file not found: {stored_filename}")
        return path.read_bytes()

    def save_extracted_content(self, document_id: str, data: Dict[str, Any]) -> Path:
        """Save extracted structured JSON content to extracted directory."""
        target_path = self._resolve_safe_path(self.extracted_dir, f"{document_id}.json")
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        return target_path

    def read_extracted_content(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Read extracted structured JSON content."""
        target_path = self._resolve_safe_path(self.extracted_dir, f"{document_id}.json")
        if not target_path.exists():
            return None
        with open(target_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def delete_document_files(self, stored_filename: str, document_id: str) -> None:
        """Clean up raw upload and extracted JSON files."""
        try:
            upload_path = self.get_upload_path(stored_filename)
            if upload_path.exists():
                upload_path.unlink()
        except Exception:
            pass

        try:
            extracted_path = self._resolve_safe_path(self.extracted_dir, f"{document_id}.json")
            if extracted_path.exists():
                extracted_path.unlink()
        except Exception:
            pass


storage_service = StorageService()
