from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.ai_summary import AISummary
from app.models.project import Project
from app.models.user import User
from app.schemas.ai_summary import AISummaryRead
from app.services.project_summary import generate_project_summary


router = APIRouter(
    prefix="/projects/{project_id}/summary",
    tags=["Project Summary"],
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


@router.get("/latest", response_model=AISummaryRead | None)
def get_latest_project_summary(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    return (
        db.query(AISummary)
        .filter(
            AISummary.project_id == project_id,
            AISummary.type == "PROJECT_STATUS",
        )
        .order_by(AISummary.created_at.desc())
        .first()
    )


@router.post("/generate", response_model=AISummaryRead)
def generate_project_status_summary(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_user_project_or_404(project_id, db, current_user)

    try:
        content = generate_project_summary(db=db, project=project)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    summary = AISummary(
        project_id=project_id,
        type="PROJECT_STATUS",
        content=content,
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary
