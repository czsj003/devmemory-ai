import re


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(
    text: str,
    chunk_size: int = 800,
    overlap: int = 120,
) -> list[str]:
    cleaned_text = clean_text(text)

    if not cleaned_text:
        return []

    words = cleaned_text.split()

    if len(words) <= chunk_size:
        return [cleaned_text]

    chunks: list[str] = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk = " ".join(chunk_words).strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(words):
            break

        start += chunk_size - overlap

    return chunks