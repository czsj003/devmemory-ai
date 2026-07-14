from typing import Any

from app.services.llm import generate_text
from app.services.prompt_builder import build_rag_system_prompt, build_rag_user_prompt


def generate_rag_answer(
    user_message: str,
    sources: list[dict[str, Any]],
) -> str:
    if not sources:
        return (
            "I could not find enough indexed project memory to answer this question yet.\n\n"
            "Try adding relevant documents, daily notes, bug records, or architecture decisions, then re-index project memory."
        )

    system_prompt = build_rag_system_prompt()
    user_prompt = build_rag_user_prompt(
        user_message=user_message,
        sources=sources,
    )

    return generate_text(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.2,
    )
