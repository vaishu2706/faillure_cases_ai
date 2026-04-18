from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import UPLOAD_DIR
from models import QueryRequest, QueryResponse, UploadResponse, SourceChunk
from document_store import store_document, list_documents, delete_document, load_index
from retriever import index_document, remove_document_from_index, retrieve
from rag_chain import generate_answer
from error_handler import RAGException, rag_exception_handler

app = FastAPI(title="RAG System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RAGException, rag_exception_handler)


@app.on_event("startup")
def startup():
    """Load persisted document index on boot."""
    load_index()


# ── Upload ────────────────────────────────────────────────────────────────────

@app.post("/documents/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    file_bytes = await file.read()
    doc_id, chunks = store_document(file_bytes, file.filename)
    index_document(doc_id, [c for c in chunks])
    return UploadResponse(
        doc_id=doc_id,
        filename=file.filename,
        chunks_stored=len(chunks),
        message=f"Document '{file.filename}' uploaded and indexed successfully.",
    )


# ── List & Delete ─────────────────────────────────────────────────────────────

@app.get("/documents")
def get_documents():
    return {"documents": list_documents()}


@app.delete("/documents/{doc_id}")
def remove_document(doc_id: str):
    removed = delete_document(doc_id)
    if not removed:
        raise RAGException("no_document", f"Document '{doc_id}' not found.", 404)
    remove_document_from_index(doc_id)
    return {"message": f"Document '{doc_id}' deleted."}


# ── Query ─────────────────────────────────────────────────────────────────────

@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    chunks = retrieve(req.question, doc_id=req.doc_id)
    answer = generate_answer(req.question, chunks)
    sources = [
        SourceChunk(
            doc_id=c["doc_id"],
            filename=c["filename"],
            chunk_index=c["chunk_index"],
            text=c["text"][:300],
            score=round(c["score"], 4),
        )
        for c in chunks
    ]
    return QueryResponse(answer=answer, sources=sources)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}
