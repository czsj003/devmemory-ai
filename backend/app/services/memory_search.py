from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.embedding import generate_embedding


def search_project_memory_chunks(
    db: Session,
    project_id: int,
    query: str,
    top_k: int = 5,
    source_type: str | None = None,
):
    """
    Search unified memory chunks inside one project.

    The unified index can include documents, daily notes, bug memory, and
    architecture decisions. Existing document-only search stays available in
    semantic_search.py for comparison/debugging.
    """
    query_embedding = generate_embedding(query)
    embedding_text = "[" + ",".join(str(value) for value in query_embedding) + "]"

    source_type_filter = ""
    params = {
        "query_embedding": embedding_text,
        "project_id": project_id,
        "top_k": top_k,
    }

    if source_type:
        source_type_filter = "AND source_type = :source_type"
        params["source_type"] = source_type

    statement = text(
        f"""
        SELECT
            id AS chunk_id,
            project_id AS project_id,
            source_type AS source_type,
            source_id AS source_id,
            source_title AS source_title,
            content AS content,
            chunk_index AS chunk_index,
            embedding <-> CAST(:query_embedding AS vector) AS distance
        FROM memory_chunks
        WHERE project_id = :project_id
          AND embedding IS NOT NULL
          {source_type_filter}
        ORDER BY embedding <-> CAST(:query_embedding AS vector)
        LIMIT :top_k
        """
    )

    return db.execute(statement, params).mappings().all()
