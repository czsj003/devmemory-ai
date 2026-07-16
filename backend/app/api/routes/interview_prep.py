from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.interview_prep import InterviewPrep
from app.models.project import Project
from app.models.user import User
from app.schemas.interview_prep import (
    InterviewPrepGenerateRequest,
    InterviewPrepGenerateResponse,
    InterviewPrepRead,
)
from app.services.interview_prep import generate_interview_prep_content


router = APIRouter(
    prefix="/projects/{project_id}/interview-prep",
    tags=["Interview Prep"],
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


@router.get("/latest", response_model=InterviewPrepRead | None)
def get_latest_interview_prep(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    return (
        db.query(InterviewPrep)
        .filter(InterviewPrep.project_id == project_id)
        .order_by(InterviewPrep.created_at.desc())
        .first()
    )


@router.post("/generate", response_model=InterviewPrepGenerateResponse)
def generate_interview_prep(
    project_id: int,
    payload: InterviewPrepGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_user_project_or_404(project_id, db, current_user)

    try:
        generated = generate_interview_prep_content(
            db=db,
            project=project,
            focus=payload.focus,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate interview prep: {str(exc)}",
        ) from exc

    prep = InterviewPrep(
        project_id=project_id,
        type="FULL_PREP",
        project_pitch=generated.get("project_pitch"),
        technical_explanation=generated.get("technical_explanation"),
        resume_bullets=generated.get("resume_bullets"),
        debugging_story=generated.get("debugging_story"),
        architecture_explanation=generated.get("architecture_explanation"),
        star_answer=generated.get("star_answer"),
    )

    db.add(prep)
    db.commit()
    db.refresh(prep)

    return InterviewPrepGenerateResponse(prep=prep)
