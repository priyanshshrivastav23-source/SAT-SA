import hashlib
import os
import re
import uuid
from pathlib import Path
from typing import Tuple, Optional
from fastapi import HTTPException, status
from app.core.config import settings


# Magic byte signatures for supported binary formats
FILE_SIGNATURES = {
    "pdf": [b"%PDF-"],
    "docx": [b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08"],
    "xlsx": [b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08"],
}


def sanitize_filename(filename: str) -> str:
    """
    Sanitize the uploaded filename to prevent directory traversal and remove dangerous characters.
    """
    if not filename:
        return "unnamed_document"
    
    # Remove path elements
    clean_name = os.path.basename(filename)
    # Remove leading dots
    clean_name = clean_name.lstrip(".")
    # Replace non-alphanumeric chars (except dot, dash, underscore, space)
    clean_name = re.sub(r"[^\w\s\.-]", "_", clean_name)
    # Collapse multiple spaces or underscores
    clean_name = re.sub(r"\s+", " ", clean_name).strip()
    
    return clean_name if clean_name else "unnamed_document"


def get_file_extension(filename: str) -> str:
    """Extract lowercase file extension without dot."""
    ext = Path(filename).suffix.lower().lstrip(".")
    return ext


def compute_sha256(content: bytes) -> str:
    """Calculate SHA-256 checksum of raw file bytes."""
    return hashlib.sha256(content).hexdigest()


def generate_storage_filename(file_type: str) -> str:
    """Generate a unique, collision-free, safe storage filename."""
    unique_id = uuid.uuid4().hex
    return f"{unique_id}.{file_type}"


def validate_file_signature(file_bytes: bytes, file_type: str) -> bool:
    """
    Validate binary magic bytes signature where practical.
    """
    if file_type in FILE_SIGNATURES:
        signatures = FILE_SIGNATURES[file_type]
        return any(file_bytes.startswith(sig) for sig in signatures)
    
    if file_type in ["txt", "csv", "json"]:
        # Text based validation: check for binary null bytes or excessive control characters
        sample = file_bytes[:4096]
        if b"\x00" in sample:
            return False  # Contains binary null bytes, likely not text
        return True
    
    return True


def validate_upload(
    filename: str,
    content_type: Optional[str],
    file_bytes: bytes,
) -> Tuple[str, str, int, str]:
    """
    Comprehensive upload validation:
    - Size limits
    - Filename & Extension allowlist
    - MIME check
    - Magic bytes signature
    - SHA-256 calculation
    
    Returns: (sanitized_filename, file_type, file_size, sha256_hash)
    """
    # 1. Size Validation
    file_size = len(file_bytes)
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )
    
    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        max_mb = settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed limit of {max_mb:.1f} MB.",
        )
    
    # 2. Filename & Extension Validation
    sanitized_name = sanitize_filename(filename)
    file_ext = get_file_extension(sanitized_name)
    
    if not file_ext or file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file type '.{file_ext}'. "
                f"Supported types are: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            ),
        )
    
    # 3. Magic Bytes / Signature Validation
    if not validate_file_signature(file_bytes, file_ext):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File content does not match the expected signature for '.{file_ext}' format.",
        )
    
    # 4. Compute Hash
    file_hash = compute_sha256(file_bytes)
    
    return sanitized_name, file_ext, file_size, file_hash
