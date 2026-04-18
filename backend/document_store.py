import os
import uuid
import json
import re
from pathlib import Path
from typing import Optional

from config import UPLOAD_DIR, CHUNK_SIZE, CHUNK_OVERLAP
from error_handler import UnsupportedFileError, EmptyDocumentError

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md", ".docx"}

# In-memory index: doc_id -> {filename, chunks: [{text, chunk_index}]}
_store: dict[str, dict] = {}
_store_path = Path(UPLOAD_DIR) / "_index.json"


def _ensure_dir():
    Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


def _save_index():
    _ensure_dir()
    with open(_store_path, "w", encoding="utf-8") as f:
        json.dump(_store, f, ensure_ascii=False, indent=2)


def load_index():
    """Load persisted index from disk on startup."""
    if _store_path.exists():
        with open(_store_path, "r", encoding="utf-8") as f:
            _store.update(json.load(f))


# ── Text extraction ───────────────────────────────────────────────────────────

def _extract_text(file_bytes: bytes, filename: str) -> str:
    ext = Path(filename).suffix.lower()

    if ext not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileError(filename)

    if ext == ".txt" or ext == ".md":
        return file_bytes.decode("utf-8", errors="ignore")

    if ext == ".pdf":
        try:
            import pdfplumber
            import io
            text_parts = []
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    t = page.extract_text()
                    if t:
                        text_parts.append(t)
            return "\n".join(text_parts)
        except ImportError:
            raise EmptyDocumentError(filename)

    if ext == ".docx":
        try:
            import docx
            import io
            doc = docx.Document(io.BytesIO(file_bytes))
            return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        except ImportError:
            raise EmptyDocumentError(filename)

    return ""


# ── Chunking ──────────────────────────────────────────────────────────────────

def _chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks by word boundary."""
    words = text.split()
    chunks, i = [], 0
    while i < len(words):
        chunk = " ".join(words[i: i + CHUNK_SIZE])
        chunks.append(chunk)
        i += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


# ── Public API ────────────────────────────────────────────────────────────────

def store_document(file_bytes: bytes, filename: str) -> tuple[str, list[str]]:
    """Parse, chunk, and store a document. Returns (doc_id, chunks)."""
    _ensure_dir()

    raw_text = _extract_text(file_bytes, filename)
    clean_text = re.sub(r"\s+", " ", raw_text).strip()

    if not clean_text:
        raise EmptyDocumentError(filename)

    chunks = _chunk_text(clean_text)
    doc_id = str(uuid.uuid4())

    _store[doc_id] = {
        "filename": filename,
        "chunks": [{"chunk_index": i, "text": c} for i, c in enumerate(chunks)],
    }
    _save_index()
    return doc_id, chunks


def get_document(doc_id: str) -> Optional[dict]:
    return _store.get(doc_id)


def get_all_chunks() -> list[dict]:
    """Return all chunks across all docs with doc_id and filename attached."""
    result = []
    for doc_id, doc in _store.items():
        for chunk in doc["chunks"]:
            result.append({
                "doc_id": doc_id,
                "filename": doc["filename"],
                "chunk_index": chunk["chunk_index"],
                "text": chunk["text"],
            })
    return result


def list_documents() -> list[dict]:
    return [
        {"doc_id": k, "filename": v["filename"], "chunk_count": len(v["chunks"])}
        for k, v in _store.items()
    ]


def delete_document(doc_id: str) -> bool:
    if doc_id not in _store:
        return False
    del _store[doc_id]
    _save_index()
    return True
