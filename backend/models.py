from pydantic import BaseModel
from typing import Optional


class QueryRequest(BaseModel):
    question: str
    doc_id: Optional[str] = None  # None = search across all docs


class SourceChunk(BaseModel):
    doc_id: str
    filename: str
    chunk_index: int
    text: str
    score: float


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]


class UploadResponse(BaseModel):
    doc_id: str
    filename: str
    chunks_stored: int
    message: str


class ErrorResponse(BaseModel):
    error: str          # machine-readable code
    message: str        # human-readable detail
    detail: Optional[str] = None
