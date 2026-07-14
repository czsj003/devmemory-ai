from datetime import datetime

from pydantic import BaseModel, Field


class MemoryChunkRead(BaseModel):
    id: int
    project_id: int
    source_type: str
    source_id: int
    source_title: str
    content: str
    chunk_index: int
    created_at: datetime

    class Config:
        from_attributes = True


class MemoryReindexResponse(BaseModel):
    project_id: int
    chunks_created: int
    documents_indexed: int
    notes_indexed: int
    bugs_indexed: int
    decisions_indexed: int


class MemoryStatsResponse(BaseModel):
    project_id: int
    total_chunks: int
    document_chunks: int
    daily_note_chunks: int
    bug_chunks: int
    decision_chunks: int


class MemorySearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)
    source_type: str | None = None


class MemorySearchResult(BaseModel):
    chunk_id: int
    project_id: int
    source_type: str
    source_id: int
    source_title: str
    content: str
    chunk_index: int
    distance: float


class MemorySearchResponse(BaseModel):
    query: str
    top_k: int
    source_type: str | None = None
    results: list[MemorySearchResult]
