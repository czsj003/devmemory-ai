# Day 3 Notes

## Goal

Implement project documents CRUD for DevMemory AI.

## Completed

- Created Document model
- Added relationship between Project and Document
- Created Document Pydantic schemas
- Created document CRUD APIs
- Added user-scoped project ownership checks
- Added Alembic migration for documents table
- Added frontend document types
- Built Documents page
- Built Document Detail page
- Added markdown preview and markdown rendering
- Added create, view, edit, and delete document flow

## Main Backend Files

- app/models/document.py
- app/schemas/document.py
- app/api/routes/documents.py
- app/models/project.py
- app/db/base.py
- app/main.py

## Main Frontend Files

- src/types/document.ts
- src/pages/DocumentsPage.tsx
- src/pages/DocumentDetailPage.tsx
- src/App.tsx

## What Works Now

Users can create, view, edit, and delete project documents inside a project workspace.

## Important Design Decision

Document APIs are nested under project routes:

/api/projects/{project_id}/documents

This keeps documents clearly scoped to a project. Before accessing any document, the backend checks that the current user owns the project.

## What We Did Not Do Today

- No file upload yet
- No PDF parsing yet
- No document chunking yet
- No embeddings yet
- No pgvector search yet
- No AI document summary yet

## Next Step

Day 4 will focus on document chunking, embedding generation, and pgvector storage.

Planned Day 4 tasks:

- Enable pgvector extension
- Create document_chunks table
- Add chunk_text function
- Generate embeddings for document chunks
- Store embeddings in PostgreSQL
- Add re-index document endpoint
