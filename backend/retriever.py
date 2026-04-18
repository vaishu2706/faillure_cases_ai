import math
from typing import Optional

from document_store import get_all_chunks, get_document
from embeddings import embed_query, embed_texts
from error_handler import NoDocumentError, NoChunksRetrievedError
from config import TOP_K

# In-memory vector index: list of {doc_id, filename, chunk_index, text, embedding}
_vector_index: list[dict] = []


def _cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def index_document(doc_id: str, chunks: list[str]):
    """Embed and add a document's chunks to the in-memory vector index."""
    doc = get_document(doc_id)
    if not doc:
        raise NoDocumentError(doc_id)

    embeddings = embed_texts(chunks)
    for i, (text, emb) in enumerate(zip(chunks, embeddings)):
        _vector_index.append({
            "doc_id": doc_id,
            "filename": doc["filename"],
            "chunk_index": i,
            "text": text,
            "embedding": emb,
        })


def remove_document_from_index(doc_id: str):
    global _vector_index
    _vector_index = [e for e in _vector_index if e["doc_id"] != doc_id]


def retrieve(question: str, doc_id: Optional[str] = None, top_k: int = TOP_K) -> list[dict]:
    """
    Retrieve top-k relevant chunks for a question.
    Raises NoDocumentError if doc_id given but not found.
    Raises NoChunksRetrievedError if index is empty or no results pass threshold.
    """
    candidates = _vector_index
    if doc_id:
        candidates = [e for e in _vector_index if e["doc_id"] == doc_id]
        if not candidates:
            raise NoDocumentError(doc_id)

    if not candidates:
        raise NoChunksRetrievedError()

    query_emb = embed_query(question)
    scored = [
        {**c, "score": _cosine(query_emb, c["embedding"])}
        for c in candidates
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    top = [s for s in scored[:top_k] if s["score"] > 0.1]

    if not top:
        raise NoChunksRetrievedError()

    return top
