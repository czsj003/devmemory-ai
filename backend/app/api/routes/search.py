from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.search import SemanticSearchRequest, SemanticSearchResponse
from app.services.semantic_search import search_project_chunks


router = APIRouter(
    prefix="/projects/{project_id}/semantic-search",
    tags=["Semantic Search"],
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


@router.get("/health")
def semantic_search_health(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    return {
        "status": "ok",
        "message": "Semantic search route is available",
        "project_id": project_id,
        "use_fake_embeddings": settings.use_fake_embeddings,
        "embedding_model": settings.embedding_model,
    }


@router.post("", response_model=SemanticSearchResponse)
def semantic_search(
    project_id: int,
    payload: SemanticSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    results = search_project_chunks(
        db=db,
        project_id=project_id,
        query=payload.query,
        top_k=payload.top_k,
    )

    return SemanticSearchResponse(
        query=payload.query,
        top_k=payload.top_k,
        results=[
            {
                "chunk_id": result["chunk_id"],
                "project_id": result["project_id"],
                "document_id": result["document_id"],
                "document_title": result["document_title"],
                "document_type": result["document_type"],
                "content": result["content"],
                "chunk_index": result["chunk_index"],
                "distance": float(result["distance"]),
            }
            for result in results
        ],
    )
