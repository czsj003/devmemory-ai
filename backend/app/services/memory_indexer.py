from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.bug import Bug
from app.models.daily_note import DailyNote
from app.models.decision import Decision
from app.models.document import Document
from app.models.memory_chunk import MemoryChunk
from app.services.chunking import chunk_text
from app.services.embedding import generate_embedding
from app.services.memory_content import (
    build_bug_memory_content,
    build_daily_note_memory_content,
    build_decision_memory_content,
    build_document_memory_content,
)


@dataclass
class MemoryIndexResult:
    chunks_created: int = 0
    documents_indexed: int = 0
    notes_indexed: int = 0
    bugs_indexed: int = 0
    decisions_indexed: int = 0


def delete_project_memory_chunks(
    db: Session,
    project_id: int,
) -> None:
    db.query(MemoryChunk).filter(
        MemoryChunk.project_id == project_id,
    ).delete()


def delete_source_memory_chunks(
    db: Session,
    project_id: int,
    source_type: str,
    source_id: int,
) -> None:
    db.query(MemoryChunk).filter(
        MemoryChunk.project_id == project_id,
        MemoryChunk.source_type == source_type,
        MemoryChunk.source_id == source_id,
    ).delete()


def index_memory_source(
    db: Session,
    project_id: int,
    source_type: str,
    source_id: int,
    source_title: str,
    content: str,
) -> int:
    delete_source_memory_chunks(
        db=db,
        project_id=project_id,
        source_type=source_type,
        source_id=source_id,
    )

    chunks = chunk_text(content)
    created_count = 0

    for index, chunk_content in enumerate(chunks):
        embedding = generate_embedding(chunk_content)
        memory_chunk = MemoryChunk(
            project_id=project_id,
            source_type=source_type,
            source_id=source_id,
            source_title=source_title,
            content=chunk_content,
            chunk_index=index,
            embedding=embedding,
        )

        db.add(memory_chunk)
        created_count += 1

    return created_count


def reindex_project_memory(
    db: Session,
    project_id: int,
) -> MemoryIndexResult:
    delete_project_memory_chunks(db, project_id)

    result = MemoryIndexResult()

    documents = (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .order_by(Document.updated_at.desc())
        .all()
    )
    notes = (
        db.query(DailyNote)
        .filter(DailyNote.project_id == project_id)
        .order_by(DailyNote.updated_at.desc())
        .all()
    )
    bugs = (
        db.query(Bug)
        .filter(Bug.project_id == project_id)
        .order_by(Bug.updated_at.desc())
        .all()
    )
    decisions = (
        db.query(Decision)
        .filter(Decision.project_id == project_id)
        .order_by(Decision.updated_at.desc())
        .all()
    )

    for document in documents:
        content = build_document_memory_content(document)
        result.chunks_created += index_memory_source(
            db=db,
            project_id=project_id,
            source_type="DOCUMENT",
            source_id=document.id,
            source_title=document.title,
            content=content,
        )
        result.documents_indexed += 1

    for note in notes:
        content = build_daily_note_memory_content(note)
        result.chunks_created += index_memory_source(
            db=db,
            project_id=project_id,
            source_type="DAILY_NOTE",
            source_id=note.id,
            source_title=note.title,
            content=content,
        )
        result.notes_indexed += 1

    for bug in bugs:
        content = build_bug_memory_content(bug)
        result.chunks_created += index_memory_source(
            db=db,
            project_id=project_id,
            source_type="BUG",
            source_id=bug.id,
            source_title=bug.title,
            content=content,
        )
        result.bugs_indexed += 1

    for decision in decisions:
        content = build_decision_memory_content(decision)
        result.chunks_created += index_memory_source(
            db=db,
            project_id=project_id,
            source_type="DECISION",
            source_id=decision.id,
            source_title=decision.title,
            content=content,
        )
        result.decisions_indexed += 1

    db.commit()

    return result
