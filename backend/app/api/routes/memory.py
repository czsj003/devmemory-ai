from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.memory_chunk import MemoryChunk
from app.models.project import Project
from app.models.user import User
from app.schemas.memory import (
    MemoryChunkRead,
    MemoryReindexResponse,
    MemorySearchRequest,
    MemorySearchResponse,
    MemoryStatsResponse,
)
from app.services.memory_indexer import reindex_project_memory
from app.services.memory_search import search_project_memory_chunks


router = APIRouter(
    prefix="/projects/{project_id}/memory",
    tags=["Unified Memory"],
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


@router.post("/reindex", response_model=MemoryReindexResponse)
def reindex_memory(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    result = reindex_project_memory(
        db=db,
        project_id=project_id,
    )

    return MemoryReindexResponse(
        project_id=project_id,
        chunks_created=result.chunks_created,
        documents_indexed=result.documents_indexed,
        notes_indexed=result.notes_indexed,
        bugs_indexed=result.bugs_indexed,
        decisions_indexed=result.decisions_indexed,
    )


@router.get("/chunks", response_model=list[MemoryChunkRead])
def get_memory_chunks(
    project_id: int,
    source_type: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    query = db.query(MemoryChunk).filter(
        MemoryChunk.project_id == project_id,
    )

    if source_type:
        query = query.filter(MemoryChunk.source_type == source_type)

    return query.order_by(MemoryChunk.created_at.desc()).limit(limit).all()


@router.post("/search", response_model=MemorySearchResponse)
def search_memory(
    project_id: int,
    payload: MemorySearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    results = search_project_memory_chunks(
        db=db,
        project_id=project_id,
        query=payload.query,
        top_k=payload.top_k,
        source_type=payload.source_type,
    )

    return MemorySearchResponse(
        query=payload.query,
        top_k=payload.top_k,
        source_type=payload.source_type,
        results=results,
    )


@router.get("/stats", response_model=MemoryStatsResponse)
def get_memory_stats(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    total_chunks = (
        db.query(MemoryChunk)
        .filter(MemoryChunk.project_id == project_id)
        .count()
    )
    document_chunks = (
        db.query(MemoryChunk)
        .filter(
            MemoryChunk.project_id == project_id,
            MemoryChunk.source_type == "DOCUMENT",
        )
        .count()
    )
    daily_note_chunks = (
        db.query(MemoryChunk)
        .filter(
            MemoryChunk.project_id == project_id,
            MemoryChunk.source_type == "DAILY_NOTE",
        )
        .count()
    )
    bug_chunks = (
        db.query(MemoryChunk)
        .filter(
            MemoryChunk.project_id == project_id,
            MemoryChunk.source_type == "BUG",
        )
        .count()
    )
    decision_chunks = (
        db.query(MemoryChunk)
        .filter(
            MemoryChunk.project_id == project_id,
            MemoryChunk.source_type == "DECISION",
        )
        .count()
    )

    return MemoryStatsResponse(
        project_id=project_id,
        total_chunks=total_chunks,
        document_chunks=document_chunks,
        daily_note_chunks=daily_note_chunks,
        bug_chunks=bug_chunks,
        decision_chunks=decision_chunks,
    )
