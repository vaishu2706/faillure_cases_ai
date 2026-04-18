from openai import OpenAI
from config import OPENAI_API_KEY, EMBED_MODEL, LLM_TIMEOUT
from error_handler import EmbeddingError, wrap_openai_error

_client = OpenAI(api_key=OPENAI_API_KEY, timeout=LLM_TIMEOUT)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Return embeddings for a list of texts. Raises EmbeddingError on failure."""
    if not texts:
        return []
    try:
        response = _client.embeddings.create(model=EMBED_MODEL, input=texts)
        return [item.embedding for item in response.data]
    except Exception as exc:
        rag_exc = wrap_openai_error(exc)
        raise EmbeddingError(detail=rag_exc.message) from exc


def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    return embed_texts([text])[0]
