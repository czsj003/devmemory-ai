from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    tech_stack = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="PLANNING")

    repo_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)

    start_date = Column(Date, nullable=True)
    target_date = Column(Date, nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    owner = relationship("User", back_populates="projects")
