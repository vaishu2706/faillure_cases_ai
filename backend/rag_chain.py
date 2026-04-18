from openai import OpenAI
from config import OPENAI_API_KEY, LLM_MODEL, LLM_TIMEOUT
from error_handler import wrap_openai_error

_client = OpenAI(api_key=OPENAI_API_KEY, timeout=LLM_TIMEOUT)

SYSTEM_PROMPT = """You are a precise document assistant.
Answer the user's question using ONLY the provided context chunks.
If the answer is not in the context, say: "I could not find an answer in the provided documents."
Be concise and factual. Cite which chunk supports your answer when possible."""


def build_context(chunks: list[dict]) -> str:
    parts = []
    for c in chunks:
        parts.append(
            f"[Source: {c['filename']} | Chunk {c['chunk_index']} | Score: {c['score']:.2f}]\n{c['text']}"
        )
    return "\n\n---\n\n".join(parts)


def generate_answer(question: str, chunks: list[dict]) -> str:
    """Call LLM with retrieved context. Raises typed RAGException on any failure."""
    context = build_context(chunks)
    user_message = f"Context:\n{context}\n\nQuestion: {question}"

    try:
        response = _client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        raise wrap_openai_error(exc) from exc
