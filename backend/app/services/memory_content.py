from app.models.bug import Bug
from app.models.daily_note import DailyNote
from app.models.decision import Decision
from app.models.document import Document


def build_document_memory_content(document: Document) -> str:
    return f"""
Source Type: DOCUMENT
Title: {document.title}
Document Type: {document.type}
Source: {document.source}

Content:
{document.content}
""".strip()


def build_daily_note_memory_content(note: DailyNote) -> str:
    return f"""
Source Type: DAILY_NOTE
Title: {note.title}
Date: {note.note_date}

Content:
{note.content}

Completed Tasks:
{note.completed_tasks or "Not provided."}

Blockers:
{note.blockers or "Not provided."}

Next Steps:
{note.next_steps or "Not provided."}

AI Summary:
{note.ai_summary or "Not provided."}
""".strip()


def build_bug_memory_content(bug: Bug) -> str:
    return f"""
Source Type: BUG
Title: {bug.title}
Severity: {bug.severity}
Status: {bug.status}
Tech Stack: {bug.tech_stack or "Not provided."}

Error Message:
{bug.error_message or "Not provided."}

Logs:
{bug.logs or "Not provided."}

Root Cause:
{bug.root_cause or "Not provided."}

Fix Summary:
{bug.fix_summary or "Not provided."}

AI Analysis:
{bug.ai_analysis or "Not provided."}
""".strip()


def build_decision_memory_content(decision: Decision) -> str:
    return f"""
Source Type: DECISION
Title: {decision.title}
Status: {decision.status}

Context:
{decision.context}

Decision:
{decision.decision}

Alternatives:
{decision.alternatives or "Not provided."}

Consequences:
{decision.consequences or "Not provided."}

AI Draft:
{decision.ai_draft or "Not provided."}
""".strip()
