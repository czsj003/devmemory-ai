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

- Day 1: Project setup and architecture design
- Day 2: Authentication and project workspace CRUD
- Day 3: Project documents CRUD
- Day 4: Document chunking, embeddings, and pgvector storage
- Day 5: Project-aware semantic search
- Day 6: AI Chat with sources using fake AI responses
- Day 7: Daily Development Notes CRUD

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
