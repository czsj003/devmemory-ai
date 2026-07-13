# Day 11 Notes

## Goal

Replace fake AI chat answers with real source-grounded RAG answers using OpenAI.

## Completed

- Created prompt builder service
- Created RAG answer service
- Replaced fake chat answer generation
- Used semantic search results as LLM context
- Added insufficient-context behavior
- Saved real assistant answers to chat_messages
- Preserved source display under assistant messages
- Updated ChatPage development notice
- Tested the LLM service with a minimal OpenAI call

## Main Backend Files

- app/services/prompt_builder.py
- app/services/rag_answer.py
- app/services/chat_service.py
- app/api/routes/chat.py

## Main Frontend Files

- src/pages/ChatPage.tsx

## What Works Now

Users can ask project-aware questions. The backend retrieves relevant project memory chunks, sends them to OpenAI as context, generates a real answer, saves the assistant message, and returns sources.

## Important Design Decision

The assistant answers only from retrieved project sources. If sources are missing or insufficient, the system says that more project memory is needed instead of inventing an answer.

## What We Did Not Do Today

- No streaming response
- No multi-session chat UI
- No chat history context in prompts
- No unified memory_chunks yet
- No notes, bugs, or decisions retrieval yet

## Next Step

Day 12 can focus on unified memory indexing so AI Chat can retrieve documents, notes, bugs, and decisions through one memory table.
