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

How to explain:

This page lets users review and update the full content of a project document.
