# RAG System

A Retrieval-Augmented Generation (RAG) application that lets you upload documents and ask questions against them. The backend uses OpenAI embeddings + GPT to find and answer from relevant document chunks; the frontend is a React/Vite UI.

## Project Structure

```
failure_checks_docs/
├── backend/        # FastAPI Python server
└── frontend/       # React + Vite client
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- An OpenAI API key

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Copy the example env file and fill in your key:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | *(required)* | Your OpenAI API key |
| `LLM_MODEL` | `gpt-3.5-turbo` | Chat model to use |
| `EMBED_MODEL` | `text-embedding-3-small` | Embedding model |
| `TOP_K` | `4` | Number of chunks retrieved per query |
| `CHUNK_SIZE` | `500` | Characters per document chunk |
| `CHUNK_OVERLAP` | `50` | Overlap between chunks |
| `UPLOAD_DIR` | `uploaded_docs` | Directory for stored documents |

Start the server:

```bash
uvicorn main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/documents/upload` | Upload a PDF or DOCX file |
| `GET` | `/documents` | List all uploaded documents |
| `DELETE` | `/documents/{doc_id}` | Delete a document |
| `POST` | `/query` | Ask a question (optionally scoped to a `doc_id`) |
| `GET` | `/health` | Health check |

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

UI runs at `http://localhost:5173` and proxies API calls to the backend.

### Key Components

| Component | Purpose |
|---|---|
| `UploadPanel` | Upload PDF/DOCX documents |
| `DocumentList` | View and delete uploaded documents |
| `QueryPanel` | Submit questions |
| `AnswerPanel` | Display the generated answer and source chunks |
| `ErrorBanner` | Show error messages |

---

## How It Works

1. Upload a document → it is chunked and embedded via OpenAI, then stored in a local vector index.
2. Ask a question → the top-K most relevant chunks are retrieved and passed to the LLM as context.
3. The LLM answers using only the provided context, citing the source chunks.
