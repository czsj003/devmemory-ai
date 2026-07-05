from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.daily_note import DailyNote
from app.models.project import Project
from app.models.user import User
from app.schemas.daily_note import DailyNoteCreate, DailyNoteRead, DailyNoteUpdate


router = APIRouter(
    prefix="/projects/{project_id}/notes",
    tags=["Daily Notes"],
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


@router.get("", response_model=list[DailyNoteRead])
def get_daily_notes(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    return (
        db.query(DailyNote)
        .filter(DailyNote.project_id == project_id)
        .order_by(DailyNote.note_date.desc().nullslast(), DailyNote.created_at.desc())
        .all()
    )


@router.post("", response_model=DailyNoteRead, status_code=status.HTTP_201_CREATED)
def create_daily_note(
    project_id: int,
    payload: DailyNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    note = DailyNote(
        project_id=project_id,
        title=payload.title,
        note_date=payload.note_date,
        content=payload.content,
        completed_tasks=payload.completed_tasks,
        blockers=payload.blockers,
        next_steps=payload.next_steps,
        ai_summary=payload.ai_summary,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


@router.get("/{note_id}", response_model=DailyNoteRead)
def get_daily_note(
    project_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    note = (
        db.query(DailyNote)
        .filter(
            DailyNote.id == note_id,
            DailyNote.project_id == project_id,
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily note not found",
        )

    return note


@router.put("/{note_id}", response_model=DailyNoteRead)
def update_daily_note(
    project_id: int,
    note_id: int,
    payload: DailyNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    note = (
        db.query(DailyNote)
        .filter(
            DailyNote.id == note_id,
            DailyNote.project_id == project_id,
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily note not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_daily_note(
    project_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    note = (
        db.query(DailyNote)
        .filter(
            DailyNote.id == note_id,
            DailyNote.project_id == project_id,
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily note not found",
        )

    db.delete(note)
    db.commit()

    return None
