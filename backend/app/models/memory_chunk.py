from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

from app.core.config import settings
from app.db.database import Base


class MemoryChunk(Base):
    __tablename__ = "memory_chunks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=False, index=True)
    source_type = Column(String(50), nullable=False, index=True)
    source_id = Column(Integer, nullable=False, index=True)
    source_title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    embedding = Column(Vector(settings.embedding_dimension), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
