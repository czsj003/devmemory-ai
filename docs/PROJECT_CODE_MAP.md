# Project Code Map

This file explains what important files do in simple language.

The goal is not to explain every line of code.  
The goal is to help someone quickly understand the project and explain it in an interview.

## Backend

### backend/app/main.py

Purpose:

Main entry point of the FastAPI backend.

What it does:

- Creates the FastAPI app
- Configures CORS
- Registers API routers
- Provides health check endpoints

How to explain:

This file starts the backend API and connects the main route groups such as authentication and projects.

---

### backend/app/core/security.py

Purpose:

Handles password security and JWT creation.

What it does:

- Hashes user passwords
- Verifies login passwords
- Creates JWT access tokens

How to explain:

This file provides the security utilities used by the authentication system.

---

### backend/app/api/deps.py

Purpose:

Defines reusable FastAPI dependencies.

What it does:

- Reads the JWT token from requests
- Validates the token
- Loads the current logged-in user

How to explain:

This file protects private API routes by identifying the current user from the JWT token.

---

### backend/app/models/user.py

Purpose:

Defines the users database table.

How to explain:

This model represents application users and owns project workspaces.

---

### backend/app/models/project.py

Purpose:

Defines the projects database table.

How to explain:

This model represents a project workspace. Each project belongs to a specific user.

---

### backend/app/api/routes/auth.py

Purpose:

Handles authentication API routes.

How to explain:

This route file contains the backend endpoints for account creation, login, and user identity.

---

### backend/app/api/routes/projects.py

Purpose:

Handles project workspace API routes.

How to explain:

This route file manages project workspaces and ensures users can only access their own projects.

---

### backend/app/models/document.py

Purpose:

Defines the documents database table.

What it does:

- Stores project document title, type, content, and source
- Connects each document to a project
- Tracks creation and update time

How to explain:

This model represents project documents such as README files, specs, API notes, database notes, deployment notes, and logs. Each document belongs to one project workspace.

---

### backend/app/schemas/document.py

Purpose:

Defines request and response shapes for document APIs.

What it does:

- Defines data needed to create a document
- Defines data allowed when updating a document
- Defines what document data is returned to the frontend

How to explain:

This file keeps document API input and output validation organized using Pydantic schemas.

---

### backend/app/api/routes/documents.py

Purpose:

Handles project document API routes.

What it does:

- Lists documents for a project
- Creates a new document
- Gets one document
- Updates a document
- Deletes a document
- Ensures the current user owns the project before accessing documents

How to explain:

This route file manages project documents and protects them by checking project ownership before returning or changing data.

Day 4 update:

- Automatically indexes documents after creation
- Re-indexes documents when content changes
- Adds a manual reindex endpoint
- Adds a chunks endpoint for debugging

How to explain:

This route now connects document CRUD with the RAG indexing pipeline.

---

### backend/app/models/document_chunk.py

Purpose:

Defines the document_chunks database table.

What it does:

- Stores text chunks created from project documents
- Stores embedding vectors using pgvector
- Links each chunk to a document and project

How to explain:

This model stores the searchable units used by the RAG pipeline. Instead of sending entire documents to the AI, the system retrieves the most relevant chunks.

---

### backend/app/schemas/document_chunk.py

Purpose:

Defines the response shape for document chunks.

What it does:

- Returns chunk id, project id, document id, content, index, and created time
- Does not return embedding vectors

How to explain:

This schema allows the backend to show chunk metadata for debugging without exposing large embedding vectors to the frontend.

---

### backend/app/services/chunking.py

Purpose:

Splits long document text into smaller chunks.

What it does:

- Cleans text
- Splits content by words
- Creates overlapping chunks

How to explain:

This file prepares long documents for RAG by breaking them into smaller pieces that are easier to embed and retrieve.

---

### backend/app/services/embedding.py

Purpose:

Generates embeddings for text chunks.

What it does:

- Supports fake embeddings for local development
- Supports real OpenAI embeddings when an API key is configured

How to explain:

This file converts text chunks into vectors so the system can later perform semantic search.

---

### backend/app/services/document_indexer.py

Purpose:

Indexes a document for AI retrieval.

What it does:

- Deletes old chunks for a document
- Splits the document into chunks
- Generates embeddings for each chunk
- Saves chunks into document_chunks

How to explain:

This service turns a normal project document into searchable AI memory.

---

### backend/app/schemas/search.py

Purpose:

Defines request and response shapes for semantic search.

What it does:

- Validates the user query
- Limits top_k to a safe range
- Defines the chunk result data returned to the frontend

How to explain:

This file keeps the search API contract clear: the frontend sends a query, and the backend returns matching chunks with source document metadata.

---

### backend/app/services/semantic_search.py

Purpose:

Runs project-aware semantic search.

What it does:

- Generates an embedding for the search query
- Searches document_chunks using pgvector distance
- Filters results by project_id
- Joins chunks back to their source document

How to explain:

This service is the retrieval part of RAG. It finds the most relevant pieces of project memory before any AI answer is generated.

---

### backend/app/api/routes/search.py

Purpose:

Handles semantic search API routes.

What it does:

- Checks that the current user owns the project
- Accepts search query requests
- Calls the semantic search service
- Returns matching chunks and source document information

How to explain:

This route lets the frontend search one project's indexed memory while preventing cross-project data leaks.

---

### backend/app/models/chat_session.py

Purpose:

Defines the chat_sessions database table.

What it does:

- Stores a chat session for a project
- Connects chat history to a project workspace
- Owns related chat messages

How to explain:

This model represents a project-level chat session. It lets the app keep chat history for each project.

---

### backend/app/models/chat_message.py

Purpose:

Defines the chat_messages database table.

What it does:

- Stores user and assistant messages
- Stores assistant sources as JSONB
- Links messages to a chat session

How to explain:

This model saves the conversation history and the retrieved sources used by assistant responses.

---

### backend/app/schemas/chat.py

Purpose:

Defines request and response shapes for project chat.

What it does:

- Defines chat request payload
- Defines source format
- Defines chat message response
- Defines full chat response

How to explain:

This file keeps the project chat API contract clear and type-safe.

---

### backend/app/services/fake_llm.py

Purpose:

Generates development-mode AI responses without using an external LLM.

What it does:

- Creates a fake answer
- Mentions retrieved sources
- Allows chat flow testing without OpenAI API

How to explain:

This file lets the project test the chat pipeline before connecting a real LLM.

---

### backend/app/services/chat_service.py

Purpose:

Coordinates the project chat workflow.

What it does:

- Gets or creates the default chat session
- Saves user messages
- Runs semantic search
- Formats sources
- Generates a fake assistant answer
- Saves assistant messages

How to explain:

This service connects chat history, semantic retrieval, and response generation into one workflow.

---

### backend/app/api/routes/chat.py

Purpose:

Exposes project chat API routes.

What it does:

- Returns project chat messages
- Receives user chat questions
- Checks project ownership
- Returns fake answer with retrieved sources

How to explain:

This route provides project-aware chat functionality while keeping user data scoped to the current project.

---

### backend/app/models/daily_note.py

Purpose:

Defines the daily_notes database table.

What it does:

- Stores daily development notes for a project
- Tracks completed tasks, blockers, and next steps
- Stores an AI summary placeholder for future LLM integration

How to explain:

This model represents structured development logs. It helps the project remember what was built each day and what should happen next.

---

### backend/app/schemas/daily_note.py

Purpose:

Defines request and response shapes for daily notes.

What it does:

- Defines data needed to create a daily note
- Defines data allowed when updating a daily note
- Defines what note data is returned to the frontend

How to explain:

This file keeps the Daily Notes API validation organized using Pydantic schemas.

---

### backend/app/api/routes/notes.py

Purpose:

Handles Daily Notes API routes.

What it does:

- Lists notes for a project
- Creates a new daily note
- Gets one note
- Updates a note
- Deletes a note
- Ensures the current user owns the project before accessing notes

How to explain:

This route file manages daily development notes while protecting project-level user data.

---

### backend/app/models/bug.py

Purpose:

Defines the bugs database table.

What it does:

- Stores bug title, severity, status, and tech stack
- Stores error messages and logs
- Stores root cause and fix summary
- Stores an AI analysis placeholder for future LLM integration

How to explain:

This model represents structured bug memory. It helps the project remember what went wrong, why it happened, and how it was fixed.

---

### backend/app/schemas/bug.py

Purpose:

Defines request and response shapes for bugs.

What it does:

- Defines data needed to create a bug
- Defines data allowed when updating a bug
- Defines what bug data is returned to the frontend

How to explain:

This file keeps the Bug Memory API validation organized using Pydantic schemas.

---

### backend/app/api/routes/bugs.py

Purpose:

Handles Bug Memory API routes.

What it does:

- Lists bugs for a project
- Supports status and severity filters
- Creates a new bug
- Gets one bug
- Updates a bug
- Deletes a bug
- Ensures the current user owns the project before accessing bugs

How to explain:

This route file manages bug records while protecting project-level user data.

---

### backend/app/models/decision.py

Purpose:

Defines the decisions database table.

What it does:

- Stores architecture decision records
- Tracks decision status
- Stores context, decision, alternatives, and consequences
- Stores an AI draft placeholder for future LLM integration

How to explain:

This model represents architecture decision memory. It helps the project remember why technical choices were made, not just what was implemented.

---

### backend/app/schemas/decision.py

Purpose:

Defines request and response shapes for architecture decisions.

What it does:

- Defines data needed to create a decision
- Defines data allowed when updating a decision
- Defines what decision data is returned to the frontend

How to explain:

This file keeps the Architecture Decisions API validation organized using Pydantic schemas.

---

### backend/app/api/routes/decisions.py

Purpose:

Handles Architecture Decisions API routes.

What it does:

- Lists decisions for a project
- Supports status filtering
- Creates a new decision
- Gets one decision
- Updates a decision
- Deletes a decision
- Ensures the current user owns the project before accessing decisions

How to explain:

This route file manages architecture decision records while protecting project-level user data.

## Frontend

### frontend/src/api/client.ts

Purpose:

Creates the shared Axios API client.

How to explain:

This file allows the frontend to communicate with the backend and send authentication tokens.

---

### frontend/src/context/AuthContext.tsx

Purpose:

Manages frontend authentication state.

How to explain:

This file keeps track of whether the user is logged in and shares that information across the app.

---

### frontend/src/components/ProtectedRoute.tsx

Purpose:

Protects private frontend pages.

How to explain:

This component prevents unauthenticated users from accessing dashboard and project pages.

---

### frontend/src/pages/ProjectsPage.tsx

Purpose:

Project workspace list and creation page.

How to explain:

This page is where users manage their project workspaces.

---

### frontend/src/pages/ProjectDetailPage.tsx

Purpose:

Project workspace homepage.

How to explain:

This page is the main dashboard for a single project workspace.

---

### frontend/src/types/document.ts

Purpose:

Defines TypeScript types for documents.

What it does:

- Describes document data returned by the backend
- Describes payloads for creating and updating documents

How to explain:

This file helps the frontend safely work with document data.

---

### frontend/src/pages/DocumentsPage.tsx

Purpose:

Project documents list and creation page.

What it does:

- Loads the current project
- Loads all documents for that project
- Displays document cards
- Provides a form for creating new documents
- Shows a markdown preview before saving

How to explain:

This page lets users add and manage project documents that will later become searchable AI memory.

---

### frontend/src/pages/DocumentDetailPage.tsx

Purpose:

Single document view and edit page.

What it does:

- Loads one document
- Displays markdown content
- Allows editing document title, type, source, and content
- Allows deleting the document
- Allows manual re-indexing
- Displays generated chunks for debugging

How to explain:

This page lets users review and update the full content of a project document, then verify that the document has been indexed into chunks.

---

### frontend/src/types/search.ts

Purpose:

Defines TypeScript types for semantic search results.

What it does:

- Describes the shape of each search result
- Describes the full semantic search response

How to explain:

This file helps the frontend safely render search results returned by the backend.

---

### frontend/src/pages/SearchPage.tsx

Purpose:

Project semantic search page.

What it does:

- Loads the current project
- Accepts a search query
- Lets the user choose top_k
- Sends the query to the backend semantic search endpoint
- Displays matching chunks with distance scores
- Links each result back to its source document

How to explain:

This page lets users search a project's indexed memory. It is the first visible RAG feature, even though it still uses fake embeddings during local development.

---

### frontend/src/types/chat.ts

Purpose:

Defines TypeScript types for project chat.

What it does:

- Describes chat messages
- Describes chat sources
- Describes chat API response

How to explain:

This file helps the frontend safely display chat responses and source cards.

---

### frontend/src/pages/ChatPage.tsx

Purpose:

Project-aware AI chat page.

What it does:

- Loads project chat history
- Lets users send questions
- Displays user and assistant messages
- Shows retrieved sources under assistant responses
- Links sources back to original documents

How to explain:

This page gives users a chat interface for asking questions about a project's indexed memory.

---

### frontend/src/types/dailyNote.ts

Purpose:

Defines TypeScript types for daily notes.

What it does:

- Describes daily note data returned by the backend
- Describes payloads for creating and updating notes

How to explain:

This file helps the frontend safely work with daily note data.

---

### frontend/src/pages/NotesPage.tsx

Purpose:

Daily Notes list and creation page.

What it does:

- Loads the current project
- Loads all daily notes for that project
- Displays note cards
- Provides a form for creating new notes

How to explain:

This page lets users record daily project progress, blockers, and next steps.

---

### frontend/src/pages/NoteDetailPage.tsx

Purpose:

Single daily note view and edit page.

What it does:

- Loads one daily note
- Displays content, completed tasks, blockers, next steps, and AI summary placeholder
- Allows editing note fields
- Allows deleting the note

How to explain:

This page lets users review and update a specific daily development log.

---

### frontend/src/types/bug.ts

Purpose:

Defines TypeScript types for bug records.

What it does:

- Describes bug data returned by the backend
- Describes payloads for creating and updating bugs

How to explain:

This file helps the frontend safely work with bug memory data.

---

### frontend/src/pages/BugsPage.tsx

Purpose:

Bug Memory list and creation page.

What it does:

- Loads the current project
- Loads bugs for that project
- Supports status and severity filters
- Displays bug cards
- Provides a form for creating new bugs

How to explain:

This page lets users record bugs, error logs, causes, and fixes for a project.

---

### frontend/src/pages/BugDetailPage.tsx

Purpose:

Single bug view and edit page.

What it does:

- Loads one bug
- Displays error message, logs, root cause, fix summary, and AI analysis placeholder
- Allows editing bug fields
- Allows deleting the bug

How to explain:

This page lets users review and update a specific bug record.

---

### frontend/src/types/decision.ts

Purpose:

Defines TypeScript types for architecture decisions.

What it does:

- Describes decision data returned by the backend
- Describes payloads for creating and updating decisions

How to explain:

This file helps the frontend safely work with architecture decision data.

---

### frontend/src/pages/DecisionsPage.tsx

Purpose:

Architecture Decisions list and creation page.

What it does:

- Loads the current project
- Loads decisions for that project
- Supports status filtering
- Displays decision cards
- Provides a form for creating new decisions

How to explain:

This page lets users record architecture choices, alternatives, and trade-offs.

---

### frontend/src/pages/DecisionDetailPage.tsx

Purpose:

Single architecture decision view and edit page.

What it does:

- Loads one decision
- Displays context, decision, alternatives, consequences, and AI draft placeholder
- Allows editing decision fields
- Allows deleting the decision

How to explain:

This page lets users review and update a specific architecture decision record.

---

### backend/app/models/ai_summary.py

Purpose:

Defines the ai_summaries database table.

What it does:

- Stores AI-generated summaries
- Connects summaries to projects
- Tracks summary type and creation time

How to explain:

This model stores generated project summaries so users can revisit previous AI-generated project status reports.

---

### backend/app/schemas/project_overview.py

Purpose:

Defines the response shape for the project overview dashboard.

What it does:

- Returns project information
- Returns memory counts
- Returns memory coverage
- Returns recent documents, notes, bugs, and decisions
- Returns the latest AI summary

How to explain:

This schema supports the project dashboard by combining multiple project memory types into one API response.

---

### backend/app/api/routes/project_overview.py

Purpose:

Provides project overview dashboard data.

What it does:

- Counts project memory items
- Loads recent activity
- Computes memory coverage
- Returns the latest AI summary

How to explain:

This route powers the main project memory dashboard.

---

### backend/app/services/llm.py

Purpose:

Wraps OpenAI text generation.

What it does:

- Creates an OpenAI client
- Sends system and user prompts
- Returns generated text

How to explain:

This service isolates LLM calls so the rest of the backend does not directly depend on OpenAI API details.

---

### backend/app/services/project_summary.py

Purpose:

Generates AI project summaries.

What it does:

- Collects recent project context
- Builds a summary prompt
- Calls the LLM service
- Returns a project status summary

How to explain:

This service turns structured project memory into a readable project status report.

---

### backend/app/api/routes/project_summary.py

Purpose:

Exposes project summary APIs.

What it does:

- Generates a new AI project summary
- Saves the generated summary
- Returns the latest project summary

How to explain:

This route lets users generate and retrieve AI summaries for a project.

---

### frontend/src/types/aiSummary.ts

Purpose:

Defines TypeScript types for AI summaries.

What it does:

- Describes summary id, project id, type, content, and created_at

How to explain:

This file helps the frontend safely render AI-generated project summaries.

---

### frontend/src/types/projectOverview.ts

Purpose:

Defines TypeScript types for project overview dashboard data.

What it does:

- Describes project counts
- Describes memory coverage
- Describes recent project memory items
- Describes AI summary data

How to explain:

This file helps the frontend safely render the project overview dashboard.

---

### frontend/src/pages/ProjectDetailPage.tsx

Day 10 update:

- Loads project overview instead of only project details
- Displays memory counts
- Displays memory coverage
- Displays recent documents, notes, bugs, and decisions
- Allows users to generate an AI project summary

How to explain:

This page became the main project memory dashboard.
