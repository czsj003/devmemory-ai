from openai import OpenAI

from app.core.config import settings


def generate_text(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
) -> str:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is required for LLM generation")

    client = OpenAI(api_key=settings.openai_api_key)

    response = client.chat.completions.create(
        model=settings.llm_model,
        temperature=temperature,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        return "No summary generated."

    return content
