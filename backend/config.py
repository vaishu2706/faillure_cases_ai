import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
EMBED_MODEL: str = os.getenv("EMBED_MODEL", "text-embedding-3-small")
LLM_TIMEOUT: float = float(os.getenv("LLM_TIMEOUT", "20"))
TOP_K: int = int(os.getenv("TOP_K", "4"))
CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "50"))
UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploaded_docs")
