# Day 4 Notes

## Goal

Implement document chunking, embedding generation, and pgvector storage.

## Completed

- Enabled pgvector extension in PostgreSQL through migration
- Installed pgvector Python support
- Added embedding configuration to backend settings
- Created DocumentChunk model
- Created DocumentChunk schema
- Added document_chunks table migration
- Created chunk_text service
- Created embedding service
- Added fake embedding support for local development
- Created document indexer service
- Automatically indexed documents after creation
- Re-indexed documents when content changes
- Added manual reindex endpoint
- Added endpoint to view document chunks
- Added a lightweight frontend re-index button and chunks view

## Main Backend Files

- app/models/document_chunk.py
- app/schemas/document_chunk.py
- app/services/chunking.py
- app/services/embedding.py
- app/services/document_indexer.py
- app/api/routes/documents.py
- app/core/config.py
- app/db/base.py

## What Works Now

Documents can be split into chunks, converted into embeddings, and stored in PostgreSQL using pgvector.

## Important Design Decision

Each document chunk stores both document_id and project_id. This makes future project-scoped semantic search easier and prevents retrieval from mixing context between different projects.

## Fake Embeddings

Local development currently supports fake embeddings through:

USE_FAKE_EMBEDDINGS=true

This allows the indexing pipeline to work without calling an external AI API.

## What We Did Not Do Today

- No semantic search endpoint yet
- No AI chat yet
- No source citation yet
- No project summary yet
- No interview prep generation yet

## Next Step

Day 5 will focus on project-aware semantic search.

Planned Day 5 tasks:

- Generate query embeddings
- Search document_chunks by vector similarity
- Filter results by project_id
- Return top_k relevant chunks
- Add semantic search API
- Add simple frontend search UI
