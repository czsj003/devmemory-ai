# DevMemory AI

DevMemory AI is an AI-powered project memory system for developers.

It helps developers organize long-term project context such as project documents, daily development notes, bug reports, and architecture decisions. The system uses project-aware RAG to answer project-specific questions, generate project summaries, analyze bugs, suggest next steps, and prepare interview materials.

## Problem

When developers work on multi-week projects, context often becomes fragmented across README files, ChatGPT conversations, notes, bug logs, and design decisions. This makes it hard to remember what was built, why decisions were made, how bugs were fixed, and how to explain the project in interviews.

## Solution

DevMemory AI centralizes project context into structured workspaces. Each project has its own memory, including documents, notes, bugs, decisions, and AI-generated summaries. The system uses embeddings and project-scoped vector search to retrieve relevant context before generating AI responses.

## Core Features

- User authentication
- Project workspaces
- Project documents
- Daily development notes
- Bug memory
- Architecture decision records
- Project-aware AI chat
- AI project summaries
- Interview preparation generator
- Resume bullet generation

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT Authentication

### Database

- PostgreSQL
- pgvector

### AI

- Embedding API
- LLM API
- Project-aware RAG

## AI Pipeline

1. User adds project content.
2. Backend stores the original content.
3. Text is split into chunks.
4. Chunks are converted into embeddings.
5. Embeddings are stored in PostgreSQL using pgvector.
6. User asks a project-specific question.
7. Backend performs project-scoped vector search.
8. Relevant context is sent to the LLM.
9. AI generates a source-grounded response.

## Status

Day 1: Project setup and architecture design.