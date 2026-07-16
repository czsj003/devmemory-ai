import json
import re
from typing import Any

from sqlalchemy.orm import Session

from app.models.bug import Bug
from app.models.decision import Decision
from app.models.memory_chunk import MemoryChunk
from app.models.project import Project
from app.services.llm import generate_text


INTERVIEW_PREP_FIELDS = [
    "project_pitch",
    "technical_explanation",
    "resume_bullets",
    "debugging_story",
    "architecture_explanation",
    "star_answer",
]


def collect_interview_context(
    db: Session,
    project: Project,
) -> str:
    memory_chunks = (
        db.query(MemoryChunk)
        .filter(MemoryChunk.project_id == project.id)
        .order_by(MemoryChunk.created_at.desc())
        .limit(20)
        .all()
    )

    bugs = (
        db.query(Bug)
        .filter(Bug.project_id == project.id)
        .order_by(Bug.updated_at.desc())
        .limit(5)
        .all()
    )

    decisions = (
        db.query(Decision)
        .filter(Decision.project_id == project.id)
        .order_by(Decision.updated_at.desc())
        .limit(5)
        .all()
    )

    memory_context = "\n\n".join(
        [
            (
                f"Source Type: {chunk.source_type}\n"
                f"Source Title: {chunk.source_title}\n"
                f"Content:\n{chunk.content[:1200]}"
            )
            for chunk in memory_chunks
        ]
    )

    bug_context = "\n\n".join(
        [
            (
                f"Bug: {bug.title}\n"
                f"Severity: {bug.severity}\n"
                f"Status: {bug.status}\n"
                f"Error: {bug.error_message}\n"
                f"Root Cause: {bug.root_cause}\n"
                f"Fix Summary: {bug.fix_summary}"
            )
            for bug in bugs
        ]
    )

    decision_context = "\n\n".join(
        [
            (
                f"Decision: {decision.title}\n"
                f"Status: {decision.status}\n"
                f"Context: {decision.context}\n"
                f"Decision: {decision.decision}\n"
                f"Alternatives: {decision.alternatives}\n"
                f"Consequences: {decision.consequences}"
            )
            for decision in decisions
        ]
    )

    return f"""
Project:
Name: {project.name}
Description: {project.description}
Tech Stack: {project.tech_stack}
Status: {project.status}
Repo URL: {project.repo_url}
Live URL: {project.live_url}

Unified Memory Context:
{memory_context or "No unified memory chunks found."}

Bug Context:
{bug_context or "No bug records found."}

Architecture Decision Context:
{decision_context or "No architecture decisions found."}
""".strip()


def extract_json_text(raw_text: str) -> str:
    text = raw_text.strip()
    fence_match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)

    if fence_match:
        text = fence_match.group(1).strip()

    first_brace = text.find("{")
    last_brace = text.rfind("}")

    if first_brace != -1 and last_brace != -1 and first_brace < last_brace:
        return text[first_brace : last_brace + 1]

    return text


def normalize_generated_value(value: Any) -> str | None:
    if value is None:
        return None

    if isinstance(value, list):
        return "\n".join(f"- {item}" for item in value)

    if isinstance(value, dict):
        return json.dumps(value, ensure_ascii=False, indent=2)

    return str(value)


def parse_interview_prep_json(raw_text: str) -> dict[str, str | None]:
    try:
        parsed = json.loads(extract_json_text(raw_text))
    except json.JSONDecodeError:
        return {
            "project_pitch": raw_text,
            "technical_explanation": None,
            "resume_bullets": None,
            "debugging_story": None,
            "architecture_explanation": None,
            "star_answer": None,
        }

    return {
        field: normalize_generated_value(parsed.get(field))
        for field in INTERVIEW_PREP_FIELDS
    }


def generate_interview_prep_content(
    db: Session,
    project: Project,
    focus: str | None = None,
) -> dict[str, str | None]:
    context = collect_interview_context(db, project)
    focus_text = focus or "software engineering interviews and resume preparation"

    system_prompt = """
You are an expert technical interview coach and resume writer.

You help developers turn real project work into clear interview and resume material.

Use only the provided project context.
Do not invent technologies, features, metrics, user counts, percentages, or outcomes that are not supported by the context.

Return valid JSON only.
Do not wrap JSON in markdown code fences.
Do not include any explanation outside JSON.

The JSON must have these keys:
- project_pitch
- technical_explanation
- resume_bullets
- debugging_story
- architecture_explanation
- star_answer

Writing requirements:
- project_pitch: one concise paragraph.
- technical_explanation: explain architecture and important technical choices.
- resume_bullets: 4 to 6 strong resume bullet points. Start each bullet with an action verb. Mention technical stack when supported. Do not invent metrics.
- debugging_story: describe a real bug/debugging story if available.
- architecture_explanation: explain key architecture decisions and trade-offs.
- star_answer: one STAR-format interview answer.
""".strip()

    user_prompt = f"""
Interview focus:
{focus_text}

Project context:
{context}

Generate interview preparation material as valid JSON only.
""".strip()

    raw_text = generate_text(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.3,
    )

    return parse_interview_prep_json(raw_text)
