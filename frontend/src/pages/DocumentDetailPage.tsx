import { useCallback, useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { ProjectDocument } from "../types/document";

const DOCUMENT_TYPES = [
  "README",
  "SPEC",
  "API_DOC",
  "DATABASE",
  "DEPLOYMENT",
  "ERROR_LOG",
  "NOTE",
  "OTHER",
];

export default function DocumentDetailPage() {
  const navigate = useNavigate();
  const { projectId, documentId } = useParams();
  const [document, setDocument] = useState<ProjectDocument | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("NOTE");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDocument = useCallback(async () => {
    if (!projectId || !documentId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get<ProjectDocument>(
        `/api/projects/${projectId}/documents/${documentId}`,
      );

      setDocument(response.data);
      setTitle(response.data.title);
      setType(response.data.type);
      setContent(response.data.content);
      setSource(response.data.source || "");
    } catch {
      setError("Could not load document.");
    } finally {
      setIsLoading(false);
    }
  }, [documentId, projectId]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId || !documentId) return;

    setIsSaving(true);
    setError("");

    try {
      const response = await apiClient.put<ProjectDocument>(
        `/api/projects/${projectId}/documents/${documentId}`,
        {
          title,
          type,
          content,
          source: source || null,
        },
      );

      setDocument(response.data);
      setIsEditing(false);
    } catch {
      setError("Could not save document.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !documentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) return;

    try {
      await apiClient.delete(`/api/projects/${projectId}/documents/${documentId}`);
      navigate(`/projects/${projectId}/documents`);
    } catch {
      setError("Could not delete document.");
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading document...</p>;
  }

  if (error && !document) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">Document not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        className="text-sm text-slate-600 underline"
        to={`/projects/${projectId}/documents`}
      >
        Back to Documents
      </Link>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <p className="mt-2 text-slate-500">
              Type: {document.type} · Updated{" "}
              {new Date(document.updated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-lg border px-4 py-2"
              onClick={() => setIsEditing((value) => !value)}
              type="button"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
              onClick={handleDelete}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <form
          className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
          onSubmit={handleSave}
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              className="mt-1 w-full rounded-lg border px-4 py-2"
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              className="mt-1 w-full rounded-lg border px-4 py-2"
              onChange={(event) => setType(event.target.value)}
              value={type}
            >
              {DOCUMENT_TYPES.map((documentType) => (
                <option key={documentType} value={documentType}>
                  {documentType}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Source</span>
            <input
              className="mt-1 w-full rounded-lg border px-4 py-2"
              onChange={(event) => setSource(event.target.value)}
              placeholder="manual / GitHub / local note"
              value={source}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Content</span>
            <textarea
              className="mt-1 min-h-96 w-full rounded-lg border px-4 py-2 font-mono text-sm"
              onChange={(event) => setContent(event.target.value)}
              required
              value={content}
            />
          </label>

          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <div className="max-w-none text-sm leading-7">
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
