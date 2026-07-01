from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False, default="NOTE")
    content = Column(Text, nullable=False)
    source = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    project = relationship("Project", back_populates="documents")

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )
