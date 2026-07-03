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
- content
- ai_summary
- completed_tasks
- blockers
- next_steps
- created_at
- updated_at

### bugs

Stores bug reports and fixes.

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

Stores architecture decision records.

Fields:

- id
- project_id
- title
- context
- decision
- alternatives
- consequences
- status
- created_at
- updated_at

Status values:

- PROPOSED
- ACCEPTED
- REPLACED
- DEPRECATED

### ai_summaries

Stores generated AI summaries.

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
