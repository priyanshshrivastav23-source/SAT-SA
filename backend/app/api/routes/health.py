import sys
import sqlite3
from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.db.session import get_db
from app.parsers import PARSER_REGISTRY

router = APIRouter(tags=["Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
def check_health(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Health check endpoint returning system status, DB connectivity,
    storage health, and registered parsers.
    """
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    storage_status = {
        "upload_dir_exists": settings.UPLOAD_DIR.exists(),
        "extracted_dir_exists": settings.EXTRACTED_DIR.exists(),
        "storage_writable": True,
    }

    try:
        test_file = settings.STORAGE_DIR / ".healthcheck_tmp"
        test_file.write_text("ok")
        test_file.unlink()
    except Exception:
        storage_status["storage_writable"] = False

    return {
        "status": "healthy" if db_status == "healthy" and storage_status["storage_writable"] else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "python_version": sys.version.split()[0],
        "database": db_status,
        "storage": storage_status,
        "supported_parsers": list(PARSER_REGISTRY.keys()),
        "offline_mode": True,
    }
