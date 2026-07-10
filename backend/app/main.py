from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.routes import (
    auth,
    bugs,
    chat,
    decisions,
    documents,
    notes,
    project_overview,
    project_summary,
    projects,
    search,
)
from app.db.database import get_db

app = FastAPI(
    title="DevMemory AI API",
    description="Backend API for DevMemory AI",
    version="0.1.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(notes.router, prefix="/api")
app.include_router(bugs.router, prefix="/api")
app.include_router(decisions.router, prefix="/api")
app.include_router(project_overview.router, prefix="/api")
app.include_router(project_summary.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "DevMemory AI API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.get("/db-health")
def db_health_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()

    return {
        "database": "connected",
        "result": result,
    }
