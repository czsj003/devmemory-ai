# API Design

## Auth

POST /api/auth/register  
POST /api/auth/login  
GET /api/auth/me

## Projects

GET /api/projects  
POST /api/projects  
GET /api/projects/{project_id}  
PUT /api/projects/{project_id}  
DELETE /api/projects/{project_id}

## Documents

GET /api/projects/{project_id}/documents  
POST /api/projects/{project_id}/documents  
GET /api/projects/{project_id}/documents/{document_id}  
PUT /api/projects/{project_id}/documents/{document_id}  
DELETE /api/projects/{project_id}/documents/{document_id}  
POST /api/projects/{project_id}/documents/{document_id}/reindex
GET /api/projects/{project_id}/documents/{document_id}/chunks

### POST /api/projects/{project_id}/documents/{document_id}/reindex

Rebuilds chunks and embeddings for a document.

### GET /api/projects/{project_id}/documents/{document_id}/chunks

Returns text chunks for a document. Embedding vectors are not returned to the frontend.

## Daily Notes

GET /api/projects/{project_id}/notes  
POST /api/projects/{project_id}/notes  
GET /api/projects/{project_id}/notes/{note_id}  
PUT /api/projects/{project_id}/notes/{note_id}  
DELETE /api/projects/{project_id}/notes/{note_id}  
POST /api/projects/{project_id}/notes/{note_id}/generate-summary

## Bugs

GET /api/projects/{project_id}/bugs  
POST /api/projects/{project_id}/bugs  
GET /api/projects/{project_id}/bugs/{bug_id}  
PUT /api/projects/{project_id}/bugs/{bug_id}  
DELETE /api/projects/{project_id}/bugs/{bug_id}  
POST /api/projects/{project_id}/bugs/{bug_id}/analyze  
GET /api/projects/{project_id}/bugs/{bug_id}/similar

## Decisions

GET /api/projects/{project_id}/decisions  
POST /api/projects/{project_id}/decisions  
GET /api/projects/{project_id}/decisions/{decision_id}  
PUT /api/projects/{project_id}/decisions/{decision_id}  
DELETE /api/projects/{project_id}/decisions/{decision_id}  
POST /api/projects/{project_id}/decisions/generate-draft

## AI

POST /api/projects/{project_id}/chat  
POST /api/projects/{project_id}/semantic-search  
POST /api/projects/{project_id}/generate-summary  
POST /api/projects/{project_id}/generate-next-steps  
POST /api/projects/{project_id}/generate-interview-prep  
POST /api/projects/{project_id}/generate-resume-bullets
