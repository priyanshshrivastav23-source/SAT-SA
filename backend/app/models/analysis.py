from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.base import Base


def generate_analysis_id() -> str:
    return f"ana_{uuid.uuid4().hex[:12]}"


class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"

    id = Column(String(36), primary_key=True, default=generate_analysis_id, index=True)
    document_id = Column(
        String(36),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_version = Column(Integer, nullable=False, default=1)
    summary = Column(Text, nullable=True)
    document_overview = Column(JSON, nullable=False, default=dict)
    extracted_information = Column(JSON, nullable=False, default=dict)
    quality_checks = Column(JSON, nullable=False, default=list)
    findings = Column(JSON, nullable=False, default=list)
    limitations = Column(JSON, nullable=False, default=list)
    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    # Relationship
    document = relationship("Document", back_populates="analyses")

    __table_args__ = (
        Index("idx_analysis_doc_ver", "document_id", "analysis_version", unique=True),
    )

    def __repr__(self) -> str:
        return f"<DocumentAnalysis id={self.id} doc_id={self.document_id} v={self.analysis_version}>"
