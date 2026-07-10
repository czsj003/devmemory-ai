from sqlalchemy.orm import Session

from app.models.bug import Bug
from app.models.daily_note import DailyNote
from app.models.decision import Decision
from app.models.document import Document
from app.models.project import Project
from app.services.llm import generate_text


def collect_project_summary_context(
    db: Session,
    project: Project,
) -> str:
    documents = (
        db.query(Document)
        .filter(Document.project_id == project.id)
        .order_by(Document.updated_at.desc())
        .limit(5)
        .all()
    )

    notes = (
        db.query(DailyNote)
        .filter(DailyNote.project_id == project.id)
        .order_by(DailyNote.updated_at.desc())
        .limit(5)
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

    document_context = "\n\n".join(
        [
            (
                f"Document: {document.title}\n"
                f"Type: {document.type}\n"
                f"Content preview:\n{document.content[:1200]}"
            )
            for document in documents
        ]
    )

    notes_context = "\n\n".join(
        [
            (
                f"Daily Note: {note.title}\n"
                f"Date: {note.note_date}\n"
                f"Content: {note.content}\n"
                f"Completed: {note.completed_tasks}\n"
                f"Blockers: {note.blockers}\n"
                f"Next steps: {note.next_steps}"
            )
            for note in notes
        ]
    )

    bugs_context = "\n\n".join(
        [
            (
                f"Bug: {bug.title}\n"
                f"Severity: {bug.severity}\n"
                f"Status: {bug.status}\n"
                f"Error: {bug.error_message}\n"
                f"Root cause: {bug.root_cause}\n"
                f"Fix: {bug.fix_summary}"
            )
            for bug in bugs
        ]
    )

    decisions_context = "\n\n".join(
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
Tech stack: {project.tech_stack}
Status: {project.status}
Repo URL: {project.repo_url}
Live URL: {project.live_url}

Recent Documents:
{document_context or "No documents yet."}

Recent Daily Notes:
{notes_context or "No daily notes yet."}

Recent Bugs:
{bugs_context or "No bugs yet."}

Recent Architecture Decisions:
{decisions_context or "No architecture decisions yet."}
""".strip()


def generate_project_summary(
    db: Session,
    project: Project,
) -> str:
    context = collect_project_summary_context(db, project)

    system_prompt = """
You are an AI project memory assistant.

Your job is to summarize a software project based only on the provided project context.

Write a clear, useful project status summary for the developer.

Include:
1. What this project is
2. What has been implemented so far
3. Current technical architecture
4. Important bugs or risks
5. Important architecture decisions
6. Recommended next steps

Rules:
- Do not invent features not present in the context.
- If information is missing, say what is missing.
- Keep the tone professional and practical.
- Use concise sections with headings.
""".strip()

    user_prompt = f"""
Please generate a project status summary based on this context:

{context}
""".strip()

    return generate_text(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.3,
    )
