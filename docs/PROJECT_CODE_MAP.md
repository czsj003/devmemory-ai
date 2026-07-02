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
