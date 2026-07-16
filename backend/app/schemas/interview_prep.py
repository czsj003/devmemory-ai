from datetime import datetime

from pydantic import BaseModel


class InterviewPrepRead(BaseModel):
    id: int
    project_id: int
    type: str
    project_pitch: str | None = None
    technical_explanation: str | None = None
    resume_bullets: str | None = None
    debugging_story: str | None = None
    architecture_explanation: str | None = None
    star_answer: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class InterviewPrepGenerateRequest(BaseModel):
    focus: str | None = None


class InterviewPrepGenerateResponse(BaseModel):
    prep: InterviewPrepRead
