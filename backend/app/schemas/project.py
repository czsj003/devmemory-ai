from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    status: str = "PLANNING"
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    status: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None


class ProjectRead(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True