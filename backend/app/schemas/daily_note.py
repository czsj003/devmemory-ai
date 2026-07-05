from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class DailyNoteBase(BaseModel):
    title: str
    note_date: Optional[date] = None
    content: str
    completed_tasks: Optional[str] = None
    blockers: Optional[str] = None
    next_steps: Optional[str] = None
    ai_summary: Optional[str] = None


class DailyNoteCreate(DailyNoteBase):
    pass


class DailyNoteUpdate(BaseModel):
    title: Optional[str] = None
    note_date: Optional[date] = None
    content: Optional[str] = None
    completed_tasks: Optional[str] = None
    blockers: Optional[str] = None
    next_steps: Optional[str] = None
    ai_summary: Optional[str] = None


class DailyNoteRead(DailyNoteBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
