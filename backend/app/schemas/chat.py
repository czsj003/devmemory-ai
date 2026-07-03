from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=10)


class ChatSource(BaseModel):
    chunk_id: int
    document_id: int
    document_title: str
    document_type: str
    content: str
    chunk_index: int
    distance: float


class ChatMessageRead(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    sources: Optional[list[dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
    messages: list[ChatMessageRead]
