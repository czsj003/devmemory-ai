from pydantic import BaseModel, Field


class SemanticSearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)


class SemanticSearchResult(BaseModel):
    chunk_id: int
    project_id: int
    document_id: int
    document_title: str
    document_type: str
    content: str
    chunk_index: int
    distance: float


class SemanticSearchResponse(BaseModel):
    query: str
    top_k: int
    results: list[SemanticSearchResult]
