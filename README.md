# DevMemory AI

DevMemory AI is an AI-powered project memory workspace for developers.

It helps developers store project documents, daily notes, bug records, architecture decisions, and AI-generated summaries in one workspace. The system indexes project memory with embeddings and uses source-grounded AI chat to answer questions based on the actual project history.

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
- Unified memory indexing
- Unified semantic search
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

- Day 1: Project setup and architecture design
- Day 2: Authentication and project workspace CRUD
- Day 3: Project documents CRUD
- Day 4: Document chunking, embeddings, and pgvector storage
- Day 5: Project-aware semantic search
- Day 6: AI Chat with sources using fake AI responses
- Day 7: Daily Development Notes CRUD
- Day 8: Bug Memory CRUD
- Day 9: Architecture Decisions / ADR CRUD
- Day 10: Project overview dashboard and real AI project summaries
- Day 11: Real source-grounded AI chat
- Day 12: Unified memory indexing
- Day 13: Unified memory search and unified AI chat
- Day 14: Interview Prep and Resume Bullet Generator
- Day 15: Final product polish and completion cleanup

Local MVP completed through Day 15 polish.

Deployment is intentionally skipped for this version.

## Development Log

### Day 1

Initialized the full-stack project structure with React, TypeScript, FastAPI, PostgreSQL, pgvector, and documentation.

### Day 2

Implemented user authentication, JWT-based protected routes, user-scoped project workspaces, and the initial project dashboard flow.

### Day 3

Implemented project document management. Users can create, view, edit, and delete documents inside project workspaces. Documents are scoped to projects and protected by user ownership checks.

### Day 4

Implemented the document indexing layer for RAG. Documents are now split into chunks, converted into embeddings, and stored in PostgreSQL using pgvector. Added automatic indexing after document creation, re-indexing when document content changes, and endpoints for manual re-indexing and viewing chunks.

### Day 5

Implemented project-aware semantic search. Users can search indexed document chunks inside a specific project workspace. The backend generates a query embedding, searches pgvector chunks by distance, filters results by project ownership and project_id, and returns matching chunks with source document metadata. The frontend now has a Semantic Search page linked from each project.

### Day 6

Implemented project-aware chat with sources. The backend now saves chat sessions and messages, retrieves relevant project memory chunks for each user question, generates a development-mode fake AI answer, and stores sources with assistant messages. The frontend includes a Chat page that displays conversation history and source cards linked to original documents.

### Day 7

Implemented Daily Development Notes. Users can now create, view, edit, and delete structured daily notes inside a project workspace. Each note can track content, completed tasks, blockers, next steps, and an AI summary placeholder for future LLM integration.

### Day 8

Implemented Bug Memory. Users can now create, view, edit, delete, and filter structured bug records inside a project workspace. Each bug can track severity, status, tech stack, error message, logs, root cause, fix summary, and an AI analysis placeholder for future LLM integration.

### Day 9

Implemented Architecture Decisions / ADR. Users can now create, view, edit, delete, and filter structured architecture decision records inside a project workspace. Each decision can track context, decision, alternatives, consequences, status, and an AI draft placeholder for future LLM integration.

### Day 10

Upgraded the project detail page into a project memory overview dashboard. Added memory counts, memory coverage, recent project activity, AI summaries, and real OpenAI-powered project summary generation. Generated summaries are saved to the ai_summaries table.

### Day 11

Replaced fake AI chat answers with real source-grounded RAG answers. The backend now retrieves relevant project memory chunks, builds a prompt from sources, calls OpenAI to generate an answer, saves the assistant message, and returns sources for frontend display.

### Day 12

Implemented unified memory indexing. Documents, daily notes, bug records, and architecture decisions can now be converted into memory chunks with embeddings and stored in a unified memory_chunks table. Added APIs and a frontend page for re-indexing project memory, viewing memory stats, and inspecting indexed chunks.

### Day 13

Upgraded search and chat to use the unified memory index. Users can now search across documents, daily notes, bug records, and architecture decisions from one endpoint. AI Chat now retrieves from memory_chunks before calling OpenAI, and source cards can link back to the original source type.

### Day 14

Implemented Interview Prep and Resume Bullet Generator. The app can now generate project pitch, technical explanation, resume bullets, debugging story, architecture explanation, and STAR interview answer from unified project memory using OpenAI. Generated prep is saved to the interview_preps table and displayed in the frontend with copy actions.

### Day 15

Polished the product experience for final local MVP completion. Reordered the project dashboard around the recommended workflow, added workflow and completion status sections, clarified AI feature guidance, improved empty and error states, and added final demo documentation.
