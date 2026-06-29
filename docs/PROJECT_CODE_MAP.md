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
