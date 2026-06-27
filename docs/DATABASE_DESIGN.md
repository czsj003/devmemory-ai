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

Stores document chunks and embeddings.

Fields:

- id
- project_id
- document_id
- content
- chunk_index
- embedding
- created_at

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
