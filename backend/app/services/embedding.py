import hashlib
import random

from openai import OpenAI

from app.core.config import settings


def generate_fake_embedding(text: str, dimension: int) -> list[float]:
    """
    Generate a deterministic fake embedding for local development.

    This is not useful for real semantic search quality,
    but it allows us to test pgvector storage and indexing flow
    without calling an external embedding API.
    """
    text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
    seed = int(text_hash[:16], 16)

    rng = random.Random(seed)

    return [rng.uniform(-1, 1) for _ in range(dimension)]


def generate_embedding(text: str) -> list[float]:
    if settings.use_fake_embeddings:
        return generate_fake_embedding(
            text=text,
            dimension=settings.embedding_dimension,
        )

    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is required when USE_FAKE_EMBEDDINGS=false")

    client = OpenAI(api_key=settings.openai_api_key)

    response = client.embeddings.create(
        model=settings.embedding_model,
        input=text,
    )

    return response.data[0].embedding