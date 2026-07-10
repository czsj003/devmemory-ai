from datetime import datetime

from pydantic import BaseModel


class AISummaryRead(BaseModel):
    id: int
    project_id: int
    type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
