# Database Design

## Overview

DevMemory AI uses PostgreSQL for relational data and pgvector for semantic search.

The system stores structured project memory such as users, projects, documents, daily notes, bugs, decisions, AI summaries, and chat messages.

## Tables

### users

Stores user accounts.

Fields:

- id
- name
- email
- password_hash
- created_at
- updated_at

### projects

Stores project workspaces.

Fields:

- id
- user_id
- name
- description
- tech_stack
- status
- repo_url
- live_url
- start_date
- target_date
- created_at
- updated_at

Status values:

- PLANNING
- IN_PROGRESS
- DEPLOYED
- ARCHIVED

### documents

Stores original project documents.

Fields:

- id
- project_id
- title
- type
- content
- source
- created_at
- updated_at

Document types:

- README
- SPEC
- API_DOC
- DATABASE
- DEPLOYMENT
- ERROR_LOG
- NOTE
- OTHER

### document_chunks

Stores document chunks and embeddings for semantic search.

Fields:

- id
- project_id
- document_id
- content
- chunk_index
- embedding
- created_at

Notes:

- embedding uses pgvector
- project_id is stored directly to support project-scoped semantic search
- document_id links the chunk back to the original document

### memory_chunks

Stores unified project memory chunks across multiple source types.

Fields:

- id
- project_id
- source_type
- source_id
- source_title
- content
- chunk_index
- embedding
- created_at

Source types:

- DOCUMENT
- DAILY_NOTE
- BUG
- DECISION

Notes:

- memory_chunks is the unified memory index.
- source_type and source_id identify the original record.
- embedding uses pgvector.
- Day 12 creates the table and reindex workflow.
- Day 13 upgrades unified search and AI chat to use memory_chunks.

## Semantic Search Design

Semantic search uses the document_chunks table.

Search flow:

1. User submits a query.
2. Backend generates a query embedding.
3. Backend searches document_chunks by vector distance.
4. Backend filters by project_id.
5. Backend returns the top_k most relevant chunks.

Important rule:

All semantic search queries must filter by project_id to prevent context from one project from being retrieved inside another project.

### daily_notes

Stores daily development logs.

Fields:

- id
- project_id
- title
- note_date
- content
- ai_summary
- completed_tasks
- blockers
- next_steps
- created_at
- updated_at

Notes:

- Daily notes belong to projects.
- Daily notes record development progress, blockers, and next steps.
- ai_summary is currently a placeholder and will be generated later when LLM integration is added.

### bugs

Stores bug reports, error logs, root causes, and fixes for a project.

Fields:

- id
- project_id
- title
- severity
- status
- tech_stack
- error_message
- logs
- root_cause
- fix_summary
- ai_analysis
- created_at
- updated_at

Notes:

- Bugs belong to projects.
- ai_analysis is currently a placeholder and will be generated later when LLM integration is added.

Status values:

- OPEN
- INVESTIGATING
- FIXED
- ARCHIVED

Severity values:

- LOW
- MEDIUM
- HIGH
- CRITICAL

### decisions

Stores architecture decision records for a project.

Fields:

- id
- project_id
- title
- status
- context
- decision
- alternatives
- consequences
- ai_draft
- created_at
- updated_at

Status values:

- PROPOSED
- ACCEPTED
- REPLACED
- DEPRECATED

Notes:

- Decisions belong to projects.
- Decisions record why technical choices were made.
- ai_draft is currently a placeholder and will be generated later when LLM integration is added.

### ai_summaries

Stores AI-generated summaries for a project.

Fields:

- id
- project_id
- type
- content
- created_at

Types:

- PROJECT_STATUS
- INTERVIEW_PREP
- NEXT_STEPS
- BUG_SUMMARY

Notes:

- Day 10 uses PROJECT_STATUS.
- Summaries are generated using OpenAI API.
- Each generated summary is stored as a historical record.

### interview_preps

Stores AI-generated interview preparation material for a project.

Fields:

- id
- project_id
- type
- project_pitch
- technical_explanation
- resume_bullets
- debugging_story
- architecture_explanation
- star_answer
- created_at

Types:

- FULL_PREP

Notes:

- Day 14 uses FULL_PREP.
- Generated content is based on unified project memory.
- Multiple generations are stored as historical records.

### chat_sessions

Stores project AI chat sessions.

Fields:

- id
- project_id
- title
- created_at
- updated_at

Notes:

- Day 6 uses one default chat session per project.
- Future versions may support multiple chat sessions per project.

### chat_messages

Stores chat messages.

Fields:

- id
- session_id
- role
- content
- sources
- created_at

Roles:

- USER
- ASSISTANT

Notes:

- assistant messages can store retrieved sources as JSONB.
- sources contain document metadata and chunk content used to generate the answer.
