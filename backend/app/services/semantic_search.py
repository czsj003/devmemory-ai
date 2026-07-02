from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.embedding import generate_embedding


def search_project_chunks(
    db: Session,
    project_id: int,
    query: str,
    top_k: int = 5,
):
    """
    Search document chunks inside a single project.

    This function:
    1. Generates an embedding for the user's query
    2. Searches document_chunks only within the given project_id
    3. Orders results by vector distance
    4. Returns the most relevant chunks with document metadata
    """
    query_embedding = generate_embedding(query)
    embedding_text = "[" + ",".join(str(value) for value in query_embedding) + "]"

    statement = text(
        """
        SELECT
            dc.id AS chunk_id,
            dc.project_id AS project_id,
            dc.document_id AS document_id,
            d.title AS document_title,
            d.type AS document_type,
            dc.content AS content,
            dc.chunk_index AS chunk_index,
            dc.embedding <-> CAST(:query_embedding AS vector) AS distance
        FROM document_chunks dc
        JOIN documents d ON d.id = dc.document_id
        WHERE dc.project_id = :project_id
          AND dc.embedding IS NOT NULL
        ORDER BY dc.embedding <-> CAST(:query_embedding AS vector)
        LIMIT :top_k
        """
    )

    return db.execute(
        statement,
        {
            "query_embedding": embedding_text,
            "project_id": project_id,
            "top_k": top_k,
        },
    ).mappings().all()
