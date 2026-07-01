from datetime import datetime

from pydantic import BaseModel


class DocumentChunkRead(BaseModel):
    id: int
    project_id: int
    document_id: int
    content: str
    chunk_index: int
    created_at: datetime

    class Config:
        from_attributes = True