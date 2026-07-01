from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.chunking import chunk_text
from app.services.embedding import generate_embedding


def delete_document_chunks(
    db: Session,
    document_id: int,
) -> None:
    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id,
    ).delete()


def index_document(
    db: Session,
    document: Document,
) -> list[DocumentChunk]:
    """
    Rebuild chunks and embeddings for a document.

    This function:
    1. Deletes existing chunks for the document
    2. Splits document content into chunks
    3. Generates embeddings for each chunk
    4. Saves chunks into document_chunks
    """
    delete_document_chunks(db, document.id)

    chunks = chunk_text(document.content)

    saved_chunks: list[DocumentChunk] = []

    for index, chunk_content in enumerate(chunks):
        embedding = generate_embedding(chunk_content)

        document_chunk = DocumentChunk(
            project_id=document.project_id,
            document_id=document.id,
            content=chunk_content,
            chunk_index=index,
            embedding=embedding,
        )

        db.add(document_chunk)
        saved_chunks.append(document_chunk)

    db.commit()

    for chunk in saved_chunks:
        db.refresh(chunk)

    return saved_chunks