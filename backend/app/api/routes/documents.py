from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.project import Project
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate
from app.schemas.document_chunk import DocumentChunkRead
from app.services.document_indexer import index_document

router = APIRouter(
    prefix="/projects/{project_id}/documents",
    tags=["Documents"],
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


@router.get("", response_model=list[DocumentRead])
def get_documents(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    documents = (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .order_by(Document.updated_at.desc())
        .all()
    )

    return documents


@router.post("", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
def create_document(
    project_id: int,
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = Document(
        project_id=project_id,
        title=payload.title,
        type=payload.type,
        content=payload.content,
        source=payload.source,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    index_document(db, document)

    return document


@router.get("/{document_id}", response_model=DocumentRead)
def get_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.project_id == project_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    return document


@router.put("/{document_id}", response_model=DocumentRead)
def update_document(
    project_id: int,
    document_id: int,
    payload: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.project_id == project_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(document, field, value)

    db.commit()
    db.refresh(document)

    if "content" in update_data:
        index_document(db, document)

    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.project_id == project_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    db.delete(document)
    db.commit()

    return None


@router.post("/{document_id}/reindex", response_model=list[DocumentChunkRead])
def reindex_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.project_id == project_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    chunks = index_document(db, document)

    return chunks


@router.get("/{document_id}/chunks", response_model=list[DocumentChunkRead])
def get_document_chunks(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_project_or_404(project_id, db, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.project_id == project_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    chunks = (
        db.query(DocumentChunk)
        .filter(
            DocumentChunk.document_id == document_id,
            DocumentChunk.project_id == project_id,
        )
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    return chunks
