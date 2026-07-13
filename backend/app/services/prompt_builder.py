from typing import Any


def build_sources_context(
    sources: list[dict[str, Any]],
    max_chars_per_source: int = 1800,
) -> str:
    if not sources:
        return "No relevant sources were retrieved."

    blocks: list[str] = []

    for index, source in enumerate(sources, start=1):
        document_title = source.get("document_title", "Unknown document")
        document_type = source.get("document_type", "UNKNOWN")
        chunk_index = source.get("chunk_index", 0)
        distance = source.get("distance", None)
        content = source.get("content", "")

        if len(content) > max_chars_per_source:
            content = content[:max_chars_per_source] + "\n...[truncated]"

        distance_text = f"{distance:.4f}" if isinstance(distance, float) else "unknown"

        blocks.append(
            f"""
[Source {index}]
Document: {document_title}
Type: {document_type}
Chunk Index: {chunk_index}
Distance: {distance_text}

Content:
{content}
""".strip()
        )

    return "\n\n---\n\n".join(blocks)


def build_rag_system_prompt() -> str:
    return """
You are DevMemory AI, a project-aware AI assistant for developers.

You must answer using only the provided project memory sources.

Strict rules:
1. Do not invent project facts.
2. Do not assume features, tools, APIs, deployment details, or architecture decisions that are not present in the sources.
3. If the sources do not contain enough information, say: "I don't have enough project memory to answer that yet."
4. You may explain what information is missing.
5. You may suggest which document, note, bug record, or decision the user should add.
6. When answering, mention relevant source documents when useful.
7. Keep answers practical and developer-focused.
8. If the user asks for interview help, convert the available source context into a clear interview explanation.
""".strip()


def build_rag_user_prompt(
    user_message: str,
    sources: list[dict[str, Any]],
) -> str:
    sources_context = build_sources_context(sources)

    return f"""
User question:
{user_message}

Retrieved project memory sources:
{sources_context}

Please answer the user's question based on the retrieved sources.

When useful, refer to sources by document title, such as:
"Based on DATABASE_DESIGN.md..."
""".strip()
