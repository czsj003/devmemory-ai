from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.bug import Bug
from app.models.project import Project
from app.models.user import User
from app.schemas.bug import BugCreate, BugRead, BugUpdate


router = APIRouter(
    prefix="/projects/{project_id}/bugs",
    tags=["Bugs"],
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


@router.get("", response_model=list[BugRead])
def get_bugs(
    project_id: int,
    status_filter: str | None = None,
    severity_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    query = db.query(Bug).filter(Bug.project_id == project_id)

    if status_filter:
        query = query.filter(Bug.status == status_filter)

    if severity_filter:
        query = query.filter(Bug.severity == severity_filter)

    return query.order_by(Bug.updated_at.desc()).all()


@router.post("", response_model=BugRead, status_code=status.HTTP_201_CREATED)
def create_bug(
    project_id: int,
    payload: BugCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    bug = Bug(
        project_id=project_id,
        title=payload.title,
        severity=payload.severity,
        status=payload.status,
        tech_stack=payload.tech_stack,
        error_message=payload.error_message,
        logs=payload.logs,
        root_cause=payload.root_cause,
        fix_summary=payload.fix_summary,
        ai_analysis=payload.ai_analysis,
    )

    db.add(bug)
    db.commit()
    db.refresh(bug)

    return bug


@router.get("/{bug_id}", response_model=BugRead)
def get_bug(
    project_id: int,
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    bug = (
        db.query(Bug)
        .filter(
            Bug.id == bug_id,
            Bug.project_id == project_id,
        )
        .first()
    )

    if not bug:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )

    return bug


@router.put("/{bug_id}", response_model=BugRead)
def update_bug(
    project_id: int,
    bug_id: int,
    payload: BugUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    bug = (
        db.query(Bug)
        .filter(
            Bug.id == bug_id,
            Bug.project_id == project_id,
        )
        .first()
    )

    if not bug:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(bug, field, value)

    db.commit()
    db.refresh(bug)

    return bug


@router.delete("/{bug_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bug(
    project_id: int,
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    bug = (
        db.query(Bug)
        .filter(
            Bug.id == bug_id,
            Bug.project_id == project_id,
        )
        .first()
    )

    if not bug:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )

    db.delete(bug)
    db.commit()

    return None
