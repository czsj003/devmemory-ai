from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

from app.core.config import settings
from app.db.database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)

    embedding = Column(Vector(settings.embedding_dimension), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    document = relationship("Document", back_populates="chunks")
