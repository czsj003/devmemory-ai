# Day 13 Notes

## Goal

Switch search and AI Chat from document-only retrieval to unified memory retrieval.

## Completed

- Added unified memory search service
- Added POST /api/projects/{project_id}/memory/search
- Added memory search request and response schemas
- Updated AI Chat to retrieve from memory_chunks
- Updated RAG prompt building for unified source types
- Updated insufficient-context message
- Updated Search page to use unified memory search
- Added source type filtering to Search
- Updated Chat source cards to support documents, notes, bugs, and decisions
- Kept old /semantic-search endpoint for document_chunks debugging

## Main Backend Files

- app/services/memory_search.py
- app/api/routes/memory.py
- app/schemas/memory.py
- app/schemas/chat.py
- app/services/chat_service.py
- app/services/prompt_builder.py
- app/services/rag_answer.py

## Main Frontend Files

- src/pages/SearchPage.tsx
- src/pages/ChatPage.tsx
- src/types/memory.ts
- src/types/chat.ts
- src/types/search.ts

## What Works Now

Users can search all indexed project memory from one page. AI Chat also uses the unified memory layer, so answers can be grounded in documents, daily notes, bug records, and architecture decisions.

## Important Design Decision

The older document_chunks pipeline was not deleted. It remains useful for debugging and comparison, while the main product flow now uses memory_chunks.

## Testing Checklist

- Open a project
- Add or confirm at least one document, note, bug, and decision
- Go to Unified Memory Index
- Click Re-index Memory
- Confirm memory chunk counts are greater than zero
- Go to Unified Memory Search
- Search across all source types
- Filter by BUG or DECISION and search again
- Go to AI Chat and ask a project-specific question
- Check that the answer shows source cards

## Next Step

Future work can make re-indexing automatic when documents, notes, bugs, or decisions are created or updated.
