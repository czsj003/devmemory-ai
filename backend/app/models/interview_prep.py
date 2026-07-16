from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class InterviewPrep(Base):
    __tablename__ = "interview_preps"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    type = Column(String(50), nullable=False, default="FULL_PREP")

    project_pitch = Column(Text, nullable=True)
    technical_explanation = Column(Text, nullable=True)
    resume_bullets = Column(Text, nullable=True)
    debugging_story = Column(Text, nullable=True)
    architecture_explanation = Column(Text, nullable=True)
    star_answer = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    project = relationship("Project", back_populates="interview_preps")
