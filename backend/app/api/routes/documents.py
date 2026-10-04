import math
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, or_

from app.core.config import settings
from app.db.session import get_db
from app.models.document import Document
from app.models.analysis import DocumentAnalysis
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentResponse,
    DocumentListResponse,
    DocumentContentResponse,
)
from app.schemas.analysis import DocumentAnalysisResponse
from app.utils.file_validation import (
    validate_upload,
    generate_storage_filename,
)
from app.services.storage_service import storage_service
from app.services.extraction_service import extraction_service
from app.services.document_analysis_service import document_analyzer

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(..., description="Document file to upload (PDF, DOCX, TXT, CSV, JSON, XLSX)"),
    db: Session = Depends(get_db),
):
    """
    Upload a document, validate it, extract its contents, execute rule-based analysis,
    and persist results.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename.",
        )

    # 1. Read file bytes safely into memory
    content = await file.read()

    # 2. Validate file (Size, Extension, Signature, Traversal check)
    sanitized_filename, file_type, file_size, file_hash = validate_upload(
        filename=file.filename,
        content_type=file.content_type,
        file_bytes=content,
    )

    # 3. Generate unique storage filename and save to local storage
    stored_filename = generate_storage_filename(file_type)
    file_path = storage_service.save_upload_file(stored_filename, content)

    # 4. Create initial document database record
    doc = Document(
        original_filename=sanitized_filename,
        stored_filename=stored_filename,
        file_type=file_type,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        sha256_hash=file_hash,
        processing_status="processing",
        extraction_status="pending",
        detected_category="unknown",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    try:
        # 5. Extract text and structured content using appropriate parser
        norm_doc = extraction_service.extract_document(
            document_id=doc.id,
            file_type=file_type,
            file_path_or_bytes=file_path,
            original_filename=sanitized_filename,
        )

        doc.extraction_status = norm_doc.extraction_status
        if norm_doc.error_message:
            doc.error_message = norm_doc.error_message

        # 6. Execute generic rule-based document analysis pipeline
        analysis_result = document_analyzer.analyze_document(
            document_id=doc.id,
            filename=sanitized_filename,
            file_type=file_type,
            file_size_bytes=file_size,
            norm_doc=norm_doc,
            analysis_version=1,
        )

        # 7. Update document record with detected category and status
        doc.detected_category = analysis_result.document_overview.detected_category
        doc.processing_status = "completed" if norm_doc.extraction_status != "failed" else "failed"

        # 8. Save analysis report to database
        db_analysis = DocumentAnalysis(
            document_id=doc.id,
            analysis_version=1,
            summary=analysis_result.document_overview.summary,
            document_overview=analysis_result.document_overview.model_dump(),
            extracted_information=analysis_result.extracted_information.model_dump(),
            quality_checks=[qc.model_dump() for qc in analysis_result.quality_checks],
            findings=[f.model_dump() for f in analysis_result.findings],
            limitations=[l.model_dump() for l in analysis_result.limitations],
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(doc)

        message = "Document uploaded and analyzed successfully."
        if norm_doc.extraction_status == "ocr_required":
            message = "Document uploaded successfully. OCR is required for scanned text extraction."
        elif norm_doc.extraction_status == "failed":
            message = f"Document uploaded, but extraction failed: {doc.error_message or 'Corrupt file format'}"

        return DocumentUploadResponse(
            document_id=doc.id,
            filename=doc.original_filename,
            file_type=doc.file_type,
            status=doc.processing_status,
            extraction_status=doc.extraction_status,
            detected_category=doc.detected_category,
            message=message,
            sha256_hash=doc.sha256_hash,
            file_size=doc.file_size,
            upload_timestamp=doc.upload_timestamp,
        )

    except Exception as e:
        doc.processing_status = "failed"
        doc.error_message = f"Analysis pipeline error: {str(e)}"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing document: {str(e)}",
        )


@router.get("", response_model=DocumentListResponse)
def list_documents(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    file_type: Optional[str] = Query(None, description="Filter by file type (e.g. pdf, docx, csv)"),
    status: Optional[str] = Query(None, description="Filter by processing status (e.g. completed, failed)"),
    category: Optional[str] = Query(None, description="Filter by detected category"),
    search: Optional[str] = Query(None, description="Search by original filename"),
    from_date: Optional[datetime] = Query(None, description="Filter by upload timestamp start"),
    to_date: Optional[datetime] = Query(None, description="Filter by upload timestamp end"),
    db: Session = Depends(get_db),
):
    """List uploaded documents with pagination and filtering."""
    query = db.query(Document)

    if file_type:
        query = query.filter(Document.file_type == file_type.lower())
    if status:
        query = query.filter(Document.processing_status == status.lower())
    if category:
        query = query.filter(Document.detected_category == category)
    if search:
        query = query.filter(Document.original_filename.ilike(f"%{search}%"))
    if from_date:
        query = query.filter(Document.upload_timestamp >= from_date)
    if to_date:
        query = query.filter(Document.upload_timestamp <= to_date)

    total = query.count()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    docs = (
        query.order_by(desc(Document.upload_timestamp))
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    doc_responses = []
    for d in docs:
        latest_ver = (
            db.query(func.max(DocumentAnalysis.analysis_version))
            .filter(DocumentAnalysis.document_id == d.id)
            .scalar()
        )
        doc_resp = DocumentResponse(
            id=d.id,
            original_filename=d.original_filename,
            stored_filename=d.stored_filename,
            file_type=d.file_type,
            mime_type=d.mime_type,
            file_size=d.file_size,
            sha256_hash=d.sha256_hash,
            upload_timestamp=d.upload_timestamp,
            processing_status=d.processing_status,
            extraction_status=d.extraction_status,
            detected_category=d.detected_category,
            error_message=d.error_message,
            latest_analysis_version=latest_ver,
        )
        doc_responses.append(doc_resp)

    return DocumentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        documents=doc_responses,
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
):
    """Get metadata and processing status for a single document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    latest_ver = (
        db.query(func.max(DocumentAnalysis.analysis_version))
        .filter(DocumentAnalysis.document_id == doc.id)
        .scalar()
    )

    return DocumentResponse(
        id=doc.id,
        original_filename=doc.original_filename,
        stored_filename=doc.stored_filename,
        file_type=doc.file_type,
        mime_type=doc.mime_type,
        file_size=doc.file_size,
        sha256_hash=doc.sha256_hash,
        upload_timestamp=doc.upload_timestamp,
        processing_status=doc.processing_status,
        extraction_status=doc.extraction_status,
        detected_category=doc.detected_category,
        error_message=doc.error_message,
        latest_analysis_version=latest_ver,
    )


@router.get("/{document_id}/analysis", response_model=DocumentAnalysisResponse)
def get_document_analysis(
    document_id: str,
    version: Optional[int] = Query(None, description="Specific analysis version to retrieve (defaults to latest)"),
    db: Session = Depends(get_db),
):
    """Retrieve structured analysis report for a document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    query = db.query(DocumentAnalysis).filter(DocumentAnalysis.document_id == document_id)
    if version is not None:
        analysis = query.filter(DocumentAnalysis.analysis_version == version).first()
    else:
        analysis = query.order_by(desc(DocumentAnalysis.analysis_version)).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No analysis report found for document '{document_id}'.",
        )

    return DocumentAnalysisResponse(
        id=analysis.id,
        document_id=doc.id,
        status=doc.processing_status,
        analysis_version=analysis.analysis_version,
        document_overview=analysis.document_overview,
        extracted_information=analysis.extracted_information,
        quality_checks=analysis.quality_checks,
        findings=analysis.findings,
        limitations=analysis.limitations,
        created_at=analysis.created_at,
    )


@router.post("/{document_id}/analyze", response_model=DocumentAnalysisResponse)
def trigger_reanalysis(
    document_id: str,
    db: Session = Depends(get_db),
):
    """
    Re-run the rule-based analysis pipeline on an existing uploaded document.
    Creates a new analysis version and updates document records.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    # 1. Get stored file
    try:
        file_path = storage_service.get_upload_path(doc.stored_filename)
        if not file_path.exists():
            raise FileNotFoundError(f"Underlying file '{doc.stored_filename}' is missing from storage.")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stored document file unavailable: {str(e)}",
        )

    # 2. Extract content
    norm_doc = extraction_service.extract_document(
        document_id=doc.id,
        file_type=doc.file_type,
        file_path_or_bytes=file_path,
        original_filename=doc.original_filename,
    )

    # 3. Calculate next version number
    latest_ver = (
        db.query(func.max(DocumentAnalysis.analysis_version))
        .filter(DocumentAnalysis.document_id == doc.id)
        .scalar()
    ) or 0
    next_ver = latest_ver + 1

    # 4. Execute analysis
    analysis_result = document_analyzer.analyze_document(
        document_id=doc.id,
        filename=doc.original_filename,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size,
        norm_doc=norm_doc,
        analysis_version=next_ver,
    )

    # 5. Update doc
    doc.extraction_status = norm_doc.extraction_status
    doc.detected_category = analysis_result.document_overview.detected_category
    doc.processing_status = "completed" if norm_doc.extraction_status != "failed" else "failed"

    # 6. Save new analysis version
    new_analysis = DocumentAnalysis(
        document_id=doc.id,
        analysis_version=next_ver,
        summary=analysis_result.document_overview.summary,
        document_overview=analysis_result.document_overview.model_dump(),
        extracted_information=analysis_result.extracted_information.model_dump(),
        quality_checks=[qc.model_dump() for qc in analysis_result.quality_checks],
        findings=[f.model_dump() for f in analysis_result.findings],
        limitations=[l.model_dump() for l in analysis_result.limitations],
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return DocumentAnalysisResponse(
        id=new_analysis.id,
        document_id=doc.id,
        status=doc.processing_status,
        analysis_version=next_ver,
        document_overview=new_analysis.document_overview,
        extracted_information=new_analysis.extracted_information,
        quality_checks=new_analysis.quality_checks,
        findings=new_analysis.findings,
        limitations=new_analysis.limitations,
        created_at=new_analysis.created_at,
    )


@router.get("/{document_id}/content", response_model=DocumentContentResponse)
def get_document_content(
    document_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve raw extracted text preview and structural summary."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    extracted_data = storage_service.read_extracted_content(document_id)
    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extracted content is not available for this document.",
        )

    full_text = extracted_data.get("extracted_text", "")
    preview = full_text[:4000] if full_text else ""

    return DocumentContentResponse(
        document_id=doc.id,
        filename=doc.original_filename,
        file_type=doc.file_type,
        extraction_status=doc.extraction_status,
        extracted_text_preview=preview,
        total_characters=len(full_text),
        page_count=extracted_data.get("page_count"),
        sheet_names=extracted_data.get("sheet_names"),
        tables_count=len(extracted_data.get("tables", [])),
        warnings=extracted_data.get("warnings", []),
    )


@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
):
    """Delete document and its stored files."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    storage_service.delete_document_files(doc.stored_filename, doc.id)
    db.delete(doc)
    db.commit()

    return {"message": f"Document '{document_id}' and all associated analyses deleted successfully."}
