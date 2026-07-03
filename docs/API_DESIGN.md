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

## Semantic Search

POST /api/projects/{project_id}/semantic-search

Searches indexed document chunks inside a specific project.

Request:

```json
{
  "query": "Why did I choose PostgreSQL and pgvector?",
  "top_k": 5
}
```

Response:

```json
{
  "query": "Why did I choose PostgreSQL and pgvector?",
  "top_k": 5,
  "results": [
    {
      "chunk_id": 1,
      "project_id": 1,
      "document_id": 2,
      "document_title": "DATABASE_DESIGN.md",
      "document_type": "DATABASE",
      "content": "DevMemory AI uses PostgreSQL...",
      "chunk_index": 0,
      "distance": 0.42
    }
  ]
}
```

Notes:

- Search is scoped by project_id.
- Only chunks from the current project are searched.
- Embedding vectors are not returned to the frontend.
- Local development currently uses fake embeddings.

## Chat

GET /api/projects/{project_id}/chat/messages
POST /api/projects/{project_id}/chat

### GET /api/projects/{project_id}/chat/messages

Returns the default chat session messages for a project.

### POST /api/projects/{project_id}/chat

Sends a project-aware chat message.

Request:

```json
{
  "message": "Why did I choose PostgreSQL and pgvector?",
  "top_k": 5
}
```

Response:

```json
{
  "answer": "This is a development-mode AI response...",
  "sources": [
    {
      "chunk_id": 1,
      "document_id": 2,
      "document_title": "DATABASE_DESIGN.md",
      "document_type": "DATABASE",
      "content": "DevMemory AI uses PostgreSQL...",
      "chunk_index": 0,
      "distance": 0.42
    }
  ],
  "messages": [
    {
      "id": 1,
      "session_id": 1,
      "role": "USER",
      "content": "Why did I choose PostgreSQL and pgvector?",
      "sources": null,
      "created_at": "..."
    },
    {
      "id": 2,
      "session_id": 1,
      "role": "ASSISTANT",
      "content": "This is a development-mode AI response...",
      "sources": [],
      "created_at": "..."
    }
  ]
}
```

Notes:

- Current version uses fake AI answers.
- Sources are retrieved from project-scoped semantic search.
- Real LLM generation will be added later.

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
