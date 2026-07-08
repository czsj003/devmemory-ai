from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.decision import Decision
from app.models.project import Project
from app.models.user import User
from app.schemas.decision import DecisionCreate, DecisionRead, DecisionUpdate


router = APIRouter(
    prefix="/projects/{project_id}/decisions",
    tags=["Architecture Decisions"],
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


@router.get("", response_model=list[DecisionRead])
def get_decisions(
    project_id: int,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    query = db.query(Decision).filter(Decision.project_id == project_id)

    if status_filter:
        query = query.filter(Decision.status == status_filter)

    return query.order_by(Decision.updated_at.desc()).all()


@router.post("", response_model=DecisionRead, status_code=status.HTTP_201_CREATED)
def create_decision(
    project_id: int,
    payload: DecisionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    decision = Decision(
        project_id=project_id,
        title=payload.title,
        status=payload.status,
        context=payload.context,
        decision=payload.decision,
        alternatives=payload.alternatives,
        consequences=payload.consequences,
        ai_draft=payload.ai_draft,
    )

    db.add(decision)
    db.commit()
    db.refresh(decision)

    return decision


@router.get("/{decision_id}", response_model=DecisionRead)
def get_decision(
    project_id: int,
    decision_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    decision = (
        db.query(Decision)
        .filter(
            Decision.id == decision_id,
            Decision.project_id == project_id,
        )
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    return decision


@router.put("/{decision_id}", response_model=DecisionRead)
def update_decision(
    project_id: int,
    decision_id: int,
    payload: DecisionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    decision = (
        db.query(Decision)
        .filter(
            Decision.id == decision_id,
            Decision.project_id == project_id,
        )
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(decision, field, value)

    db.commit()
    db.refresh(decision)

    return decision


@router.delete("/{decision_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_decision(
    project_id: int,
    decision_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    decision = (
        db.query(Decision)
        .filter(
            Decision.id == decision_id,
            Decision.project_id == project_id,
        )
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    db.delete(decision)
    db.commit()

    return None
