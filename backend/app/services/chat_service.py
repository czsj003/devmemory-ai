from typing import Any

from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession
from app.services.memory_search import search_project_memory_chunks
from app.services.rag_answer import generate_rag_answer


def get_or_create_default_chat_session(
    db: Session,
    project_id: int,
) -> ChatSession:
    session = (
        db.query(ChatSession)
        .filter(ChatSession.project_id == project_id)
        .order_by(ChatSession.created_at.asc())
        .first()
    )

    if session:
        return session

    session = ChatSession(
        project_id=project_id,
        title="Project Chat",
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def format_sources(search_results) -> list[dict[str, Any]]:
    sources: list[dict[str, Any]] = []

    for result in search_results:
        sources.append(
            {
                "chunk_id": result["chunk_id"],
                "source_type": result["source_type"],
                "source_id": result["source_id"],
                "source_title": result["source_title"],
                "content": result["content"],
                "chunk_index": result["chunk_index"],
                "distance": float(result["distance"]),
            }
        )

    return sources


def create_chat_response(
    db: Session,
    project_id: int,
    user_message: str,
    top_k: int = 5,
):
    session = get_or_create_default_chat_session(
        db=db,
        project_id=project_id,
    )

    user_chat_message = ChatMessage(
        session_id=session.id,
        role="USER",
        content=user_message,
        sources=None,
    )

    db.add(user_chat_message)
    db.commit()
    db.refresh(user_chat_message)

    search_results = search_project_memory_chunks(
        db=db,
        project_id=project_id,
        query=user_message,
        top_k=top_k,
    )
    sources = format_sources(search_results)

    answer = generate_rag_answer(
        user_message=user_message,
        sources=sources,
    )

    assistant_chat_message = ChatMessage(
        session_id=session.id,
        role="ASSISTANT",
        content=answer,
        sources=sources,
    )

    db.add(assistant_chat_message)
    db.commit()
    db.refresh(assistant_chat_message)

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc())
        .all()
    )

    return {
        "answer": answer,
        "sources": sources,
        "messages": messages,
    }


def get_project_chat_messages(
    db: Session,
    project_id: int,
) -> list[ChatMessage]:
    session = get_or_create_default_chat_session(
        db=db,
        project_id=project_id,
    )

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc())
        .all()
    )
