from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.ai_summary import AISummaryRead
from app.schemas.bug import BugRead
from app.schemas.daily_note import DailyNoteRead
from app.schemas.decision import DecisionRead
from app.schemas.document import DocumentRead
from app.schemas.project import ProjectRead


class ProjectOverviewCounts(BaseModel):
    documents_count: int
    notes_count: int
    bugs_count: int
    open_bugs_count: int
    decisions_count: int
    summaries_count: int


class ProjectMemoryCoverage(BaseModel):
    has_documents: bool
    has_notes: bool
    has_bugs: bool
    has_decisions: bool
    has_ai_summary: bool


class ProjectOverviewResponse(BaseModel):
    project: ProjectRead
    counts: ProjectOverviewCounts
    coverage: ProjectMemoryCoverage
    latest_documents: list[DocumentRead]
    latest_notes: list[DailyNoteRead]
    latest_bugs: list[BugRead]
    latest_decisions: list[DecisionRead]
    latest_summary: Optional[AISummaryRead] = None
    generated_at: datetime
