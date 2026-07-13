from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.chat import ChatMessageRead, ChatRequest, ChatResponse
from app.services.chat_service import create_chat_response, get_project_chat_messages


router = APIRouter(
    prefix="/projects/{project_id}/chat",
    tags=["Chat"],
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


@router.get("/messages", response_model=list[ChatMessageRead])
def get_chat_messages(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    return get_project_chat_messages(
        db=db,
        project_id=project_id,
    )


@router.post("", response_model=ChatResponse)
def chat_with_project(
    project_id: int,
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    try:
        return create_chat_response(
            db=db,
            project_id=project_id,
            user_message=payload.message,
            top_k=payload.top_k,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate chat response: {str(exc)}",
        ) from exc
