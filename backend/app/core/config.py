import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SAT-SA Document Analysis MVP"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Base Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR / "storage"
    UPLOAD_DIR: Path = STORAGE_DIR / "uploads"
    EXTRACTED_DIR: Path = STORAGE_DIR / "extracted"

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'storage' / 'sat_sa.db'}"

    # File Upload Security Settings
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB default
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "txt", "csv", "json", "xlsx"]
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/csv",
        "application/csv",
        "application/json",
        "text/json",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/octet-stream",  # Sometimes reported by browsers for binary formats
    ]

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Extraction / Quality Thresholds
    PDF_OCR_CHAR_THRESHOLD_PER_PAGE: int = 40  # Minimum average chars/page before flagging OCR required
    MAX_TABLE_PREVIEW_ROWS: int = 50
    MAX_SUMMARY_CHAR_LENGTH: int = 1500

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

# Ensure directories exist
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)
