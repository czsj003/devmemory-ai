from typing import Any


def generate_fake_chat_answer(
    user_message: str,
    sources: list[dict[str, Any]],
) -> str:
    if not sources:
        return (
            "This is a development-mode AI response.\n\n"
            "I could not find any indexed project memory related to your question yet. "
            "Try adding project documents and re-indexing them first.\n\n"
            "When real LLM generation is enabled, I will answer using retrieved project context."
        )

    source_titles: list[str] = []
    seen_titles = set()

    for source in sources:
        title = source.get("document_title", "Unknown source")
        if title not in seen_titles:
            source_titles.append(title)
            seen_titles.add(title)

    source_list = "\n".join(f"- {title}" for title in source_titles)

    return (
        "This is a development-mode AI response.\n\n"
        f"Your question was:\n{user_message}\n\n"
        f"I found {len(sources)} relevant project memory source(s). "
        "These sources will be used as context when real LLM generation is enabled.\n\n"
        "Relevant sources:\n"
        f"{source_list}\n\n"
        "What this means:\n"
        "The retrieval layer is working. The system can search this project's indexed memory, "
        "find related document chunks, and attach sources to the chat response.\n\n"
        "Next step:\n"
        "Later, we will replace this fake response with a real LLM-generated answer based on these retrieved sources."
    )
