# Day 6 Notes

## Goal

Implement project-aware AI Chat with sources using fake AI responses.

## Completed

- Created chat_sessions table
- Created chat_messages table
- Created chat models
- Created chat schemas
- Created fake LLM service
- Created chat service
- Created project chat API routes
- Added default chat session per project
- Saved user messages
- Ran semantic search for each user question
- Saved assistant messages with sources
- Built frontend Chat page
- Displayed chat history
- Displayed source cards under assistant responses
- Linked sources back to documents

## Main Backend Files

- app/models/chat_session.py
- app/models/chat_message.py
- app/schemas/chat.py
- app/services/fake_llm.py
- app/services/chat_service.py
- app/api/routes/chat.py
- app/main.py

## Main Frontend Files

- src/types/chat.ts
- src/pages/ChatPage.tsx
- src/pages/ProjectDetailPage.tsx

## What Works Now

Users can ask questions inside a project workspace. The backend retrieves relevant project memory chunks, generates a development-mode fake answer, saves the conversation, and returns sources.

## Important Design Decision

The system retrieves sources before generating an answer. This keeps the chat architecture ready for real RAG-based LLM responses later.

## Current Limitation

The app does not call a real LLM yet. It uses fake AI responses because OpenAI API integration is intentionally postponed.

## What We Did Not Do Today

- No OpenAI API integration
- No real LLM answer generation
- No streaming response
- No multiple chat sessions UI
- No delete chat history
- No advanced prompt engineering

## Next Step

Day 7 will focus on Daily Development Notes.

Planned Day 7 tasks:

- Create daily_notes table
- Add notes CRUD APIs
- Build Daily Notes page
- Add AI summary placeholder
- Prepare notes for future indexing
