import time
import logging
from typing import Union, Optional
from pathlib import Path

from app.parsers import get_parser, NormalizedDocument
from app.services.storage_service import storage_service

logger = logging.getLogger("sat_sa.extraction")


class ExtractionService:
    def extract_document(
        self,
        document_id: str,
        file_type: str,
        file_path_or_bytes: Union[str, Path, bytes],
        original_filename: str,
    ) -> NormalizedDocument:
        """
        Selects appropriate parser, executes extraction, saves extracted data,
        and returns normalized representation.
        """
        start_time = time.time()
        logger.info(f"Starting extraction for document {document_id} ({original_filename}, type: {file_type})")

        try:
            parser = get_parser(file_type)
            norm_doc = parser.parse(file_path_or_bytes, original_filename)
        except Exception as e:
            logger.error(f"Extraction failed for {document_id}: {str(e)}", exc_info=True)
            norm_doc = NormalizedDocument(
                document_type=file_type,
                extraction_status="failed",
                error_message=f"Parser execution failed: {str(e)}",
                warnings=["Critical error during document parsing."],
            )

        duration = time.time() - start_time
        logger.info(
            f"Extraction completed for {document_id} in {duration:.2f}s "
            f"with status: {norm_doc.extraction_status}"
        )

        # Save structured extraction result to storage
        try:
            storage_service.save_extracted_content(document_id, norm_doc.model_dump())
        except Exception as e:
            logger.warning(f"Could not persist extracted JSON for {document_id}: {str(e)}")

        return norm_doc


extraction_service = ExtractionService()
