from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DecisionBase(BaseModel):
    title: str
    status: str = "PROPOSED"
    context: str
    decision: str
    alternatives: Optional[str] = None
    consequences: Optional[str] = None
    ai_draft: Optional[str] = None


class DecisionCreate(DecisionBase):
    pass


class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    context: Optional[str] = None
    decision: Optional[str] = None
    alternatives: Optional[str] = None
    consequences: Optional[str] = None
    ai_draft: Optional[str] = None


class DecisionRead(DecisionBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
