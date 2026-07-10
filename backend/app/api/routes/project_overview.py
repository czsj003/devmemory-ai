from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.ai_summary import AISummary
from app.models.bug import Bug
from app.models.daily_note import DailyNote
from app.models.decision import Decision
from app.models.document import Document
from app.models.project import Project
from app.models.user import User
from app.schemas.project_overview import (
    ProjectMemoryCoverage,
    ProjectOverviewCounts,
    ProjectOverviewResponse,
)


router = APIRouter(
    prefix="/projects/{project_id}/overview",
    tags=["Project Overview"],
)


def get_user_project_or_404(
    project_id: int,
    db: Session,
    current_user: User,
) -> Project:
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@router.get("", response_model=ProjectOverviewResponse)
def get_project_overview(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_user_project_or_404(project_id, db, current_user)

    documents_count = db.query(Document).filter(Document.project_id == project_id).count()
    notes_count = db.query(DailyNote).filter(DailyNote.project_id == project_id).count()
    bugs_count = db.query(Bug).filter(Bug.project_id == project_id).count()
    open_bugs_count = (
        db.query(Bug)
        .filter(
            Bug.project_id == project_id,
            Bug.status.in_(["OPEN", "INVESTIGATING"]),
        )
        .count()
    )
    decisions_count = db.query(Decision).filter(Decision.project_id == project_id).count()
    summaries_count = db.query(AISummary).filter(AISummary.project_id == project_id).count()

    latest_documents = (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .order_by(Document.updated_at.desc())
        .limit(3)
        .all()
    )
    latest_notes = (
        db.query(DailyNote)
        .filter(DailyNote.project_id == project_id)
        .order_by(DailyNote.updated_at.desc())
        .limit(3)
        .all()
    )
    latest_bugs = (
        db.query(Bug)
        .filter(Bug.project_id == project_id)
        .order_by(Bug.updated_at.desc())
        .limit(3)
        .all()
    )
    latest_decisions = (
        db.query(Decision)
        .filter(Decision.project_id == project_id)
        .order_by(Decision.updated_at.desc())
        .limit(3)
        .all()
    )
    latest_summary = (
        db.query(AISummary)
        .filter(
            AISummary.project_id == project_id,
            AISummary.type == "PROJECT_STATUS",
        )
        .order_by(AISummary.created_at.desc())
        .first()
    )

    return ProjectOverviewResponse(
        project=project,
        counts=ProjectOverviewCounts(
            documents_count=documents_count,
            notes_count=notes_count,
            bugs_count=bugs_count,
            open_bugs_count=open_bugs_count,
            decisions_count=decisions_count,
            summaries_count=summaries_count,
        ),
        coverage=ProjectMemoryCoverage(
            has_documents=documents_count > 0,
            has_notes=notes_count > 0,
            has_bugs=bugs_count > 0,
            has_decisions=decisions_count > 0,
            has_ai_summary=latest_summary is not None,
        ),
        latest_documents=latest_documents,
        latest_notes=latest_notes,
        latest_bugs=latest_bugs,
        latest_decisions=latest_decisions,
        latest_summary=latest_summary,
        generated_at=datetime.now(timezone.utc),
    )
