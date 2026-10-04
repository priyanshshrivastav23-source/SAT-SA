from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, Index
from sqlalchemy.orm import relationship
from app.db.base import Base


def generate_doc_id() -> str:
    return f"doc_{uuid.uuid4().hex[:12]}"


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_doc_id, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False, unique=True)
    file_type = Column(String(16), nullable=False, index=True)
    mime_type = Column(String(128), nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    upload_timestamp = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
    processing_status = Column(String(32), nullable=False, default="pending", index=True)
    extraction_status = Column(String(32), nullable=False, default="pending", index=True)
    detected_category = Column(String(64), nullable=False, default="unknown", index=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    analyses = relationship(
        "DocumentAnalysis",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="desc(DocumentAnalysis.analysis_version)",
    )

    __table_args__ = (
        Index("idx_doc_status_type", "processing_status", "file_type"),
    )

    def __repr__(self) -> str:
        return f"<Document id={self.id} filename={self.original_filename} status={self.processing_status}>"
