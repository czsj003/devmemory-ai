# Day 2 Notes

## Goal

Implement authentication and project workspace CRUD for DevMemory AI.

## Completed

- Created User model
- Created Project model
- Added Pydantic schemas for auth, users, and projects
- Added password hashing
- Added JWT token creation
- Added current user dependency
- Created register API
- Created login API
- Created /auth/me API
- Created project CRUD APIs
- Added user-scoped project access
- Created Alembic migration for users and projects
- Connected frontend login page to backend
- Connected frontend register page to backend
- Added AuthContext
- Added ProtectedRoute
- Added API client with JWT interceptor
- Connected Projects page to backend
- Added project creation form
- Added project detail page
- Added lightweight project code map document

## Main Backend Files

- app/models/user.py
- app/models/project.py
- app/schemas/user.py
- app/schemas/auth.py
- app/schemas/project.py
- app/core/security.py
- app/api/deps.py
- app/api/routes/auth.py
- app/api/routes/projects.py

## Main Frontend Files

- src/api/client.ts
- src/context/AuthContext.tsx
- src/components/ProtectedRoute.tsx
- src/pages/LoginPage.tsx
- src/pages/RegisterPage.tsx
- src/pages/ProjectsPage.tsx
- src/pages/ProjectDetailPage.tsx
- src/layouts/AppLayout.tsx

## What Works Now

Users can register, log in, log out, create projects, view their own projects, and open a project workspace.

## Important Design Decision

All project queries are scoped by current_user.id. This prevents users from accessing other users' project data.

## Next Step

Day 3 will focus on project documents.
