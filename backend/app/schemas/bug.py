from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BugBase(BaseModel):
    title: str
    severity: str = "MEDIUM"
    status: str = "OPEN"
    tech_stack: Optional[str] = None
    error_message: Optional[str] = None
    logs: Optional[str] = None
    root_cause: Optional[str] = None
    fix_summary: Optional[str] = None
    ai_analysis: Optional[str] = None


class BugCreate(BugBase):
    pass


class BugUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    tech_stack: Optional[str] = None
    error_message: Optional[str] = None
    logs: Optional[str] = None
    root_cause: Optional[str] = None
    fix_summary: Optional[str] = None
    ai_analysis: Optional[str] = None


class BugRead(BugBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
