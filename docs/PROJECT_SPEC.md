# DevMemory AI Project Spec

## One-liner

DevMemory AI is an AI-powered project memory system for developers.

## Target Users

- Developers working on long-term software projects
- Students building resume projects
- Developers using AI tools such as ChatGPT or Cursor
- Job seekers preparing project explanations for interviews
- People managing multiple side projects

## Problem

Project context becomes fragmented across files, chat conversations, notes, bug logs, and design decisions. Developers often forget what they built, why they made certain decisions, how bugs were fixed, and how to explain the project clearly in interviews.

## Solution

DevMemory AI provides project workspaces where users can store structured project memory:

- Documents
- Daily notes
- Bug reports
- Architecture decisions
- AI summaries
- Chat history
- Interview notes

The system uses project-aware RAG to retrieve relevant project context and generate useful AI responses.

## MVP Features

### Auth

- Register
- Login
- JWT authentication
- Protected routes

### Project Workspace

- Create project
- View projects
- Edit project
- Archive project

### Documents

- Add document
- Paste markdown or text
- Store original content
- Chunk content
- Generate embeddings
- Search document chunks

### Daily Notes

- Add daily development note
- Generate AI summary
- Track completed tasks, blockers, and next steps

### Bug Memory

- Add bug report
- Store error message and logs
- Generate AI analysis
- Search similar bugs

### Architecture Decisions

- Add ADR
- Store context, decision, alternatives, and consequences
- Generate ADR draft

### AI Chat

- Ask project-specific questions
- Retrieve relevant project memory
- Generate source-grounded answers

### Interview Prep

- Generate project pitch
- Generate technical explanation
- Generate database explanation
- Generate AI/RAG explanation
- Generate resume bullet points

## Non-goals for MVP

- GitHub OAuth
- Automatic repo scanning
- Team collaboration
- VS Code extension
- Chrome extension
- Advanced PDF parsing
- Multi-model management
