from fastapi import Request
from fastapi.responses import JSONResponse
from openai import APITimeoutError, APIStatusError, AuthenticationError, RateLimitError


class RAGException(Exception):
    def __init__(self, error: str, message: str, status_code: int = 400, detail: str = None):
        self.error = error
        self.message = message
        self.status_code = status_code
        self.detail = detail


# ── Specific failure types ────────────────────────────────────────────────────

class NoDocumentError(RAGException):
    def __init__(self, doc_id: str = None):
        msg = f"No document found for ID '{doc_id}'." if doc_id else "No documents uploaded yet."
        super().__init__("no_document", msg, 404)


class NoChunksRetrievedError(RAGException):
    def __init__(self):
        super().__init__(
            "no_chunks_retrieved",
            "No relevant content found in the documents for your question.",
            404,
        )


class LLMTimeoutError(RAGException):
    def __init__(self):
        super().__init__(
            "llm_timeout",
            "The AI model took too long to respond. Please try again.",
            504,
        )


class LLMAPIError(RAGException):
    def __init__(self, detail: str = ""):
        super().__init__(
            "llm_api_failure",
            "AI API returned an error. Please check your API key or try later.",
            502,
            detail,
        )


class LLMAuthError(RAGException):
    def __init__(self):
        super().__init__(
            "llm_auth_failure",
            "Invalid OpenAI API key. Please set a valid OPENAI_API_KEY.",
            401,
        )


class LLMRateLimitError(RAGException):
    def __init__(self):
        super().__init__(
            "llm_rate_limit",
            "OpenAI rate limit reached. Please wait a moment and retry.",
            429,
        )


class UnsupportedFileError(RAGException):
    def __init__(self, filename: str):
        super().__init__(
            "unsupported_file",
            f"File '{filename}' is not supported. Upload PDF, TXT, DOCX, or MD files.",
            415,
        )


class EmptyDocumentError(RAGException):
    def __init__(self, filename: str):
        super().__init__(
            "empty_document",
            f"File '{filename}' has no extractable text content.",
            422,
        )


class EmbeddingError(RAGException):
    def __init__(self, detail: str = ""):
        super().__init__(
            "embedding_failure",
            "Failed to generate embeddings for the document.",
            502,
            detail,
        )


# ── FastAPI exception handlers ────────────────────────────────────────────────

async def rag_exception_handler(request: Request, exc: RAGException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error, "message": exc.message, "detail": exc.detail},
    )


def wrap_openai_error(exc: Exception) -> RAGException:
    """Convert any OpenAI SDK exception into a typed RAGException."""
    if isinstance(exc, APITimeoutError):
        return LLMTimeoutError()
    if isinstance(exc, AuthenticationError):
        return LLMAuthError()
    if isinstance(exc, RateLimitError):
        return LLMRateLimitError()
    if isinstance(exc, APIStatusError):
        return LLMAPIError(detail=str(exc.message))
    return LLMAPIError(detail=str(exc))
