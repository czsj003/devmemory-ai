import { useCallback, useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type {
  DocumentCreatePayload,
  ProjectDocument,
} from "../types/document";
import type { Project } from "../types/project";

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

export default function DocumentsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("NOTE");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError("");

    try {
      const [projectResponse, documentsResponse] = await Promise.all([
        apiClient.get<Project>(`/api/projects/${projectId}`),
        apiClient.get<ProjectDocument[]>(`/api/projects/${projectId}/documents`),
      ]);

      setProject(projectResponse.data);
      setDocuments(documentsResponse.data);
    } catch {
      setError("Could not load project documents.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) return;

    setIsSaving(true);
    setError("");

    const payload: DocumentCreatePayload = {
      title,
      type,
      content,
      source: source || null,
    };

    try {
      await apiClient.post<ProjectDocument>(
        `/api/projects/${projectId}/documents`,
        payload,
      );
      setTitle("");
      setType("NOTE");
      setContent("");
      setSource("");
      await loadData();
    } catch {
      setError("Could not create document.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading documents...</p>;
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="mt-2 text-slate-600">
          Store README files, specs, API docs, database notes, deployment notes,
          logs, and project notes.
        </p>
        {project && (
          <p className="mt-2 text-sm text-slate-500">Project: {project.name}</p>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
        <form className="rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Add Document</h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="PROJECT_SPEC.md"
                required
                value={title}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Type</span>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
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
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => setSource(event.target.value)}
                placeholder="manual / GitHub / local note"
                value={source}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Content</span>
              <textarea
                className="mt-1 min-h-72 w-full rounded-lg border px-3 py-2 font-mono text-sm"
                onChange={(event) => setContent(event.target.value)}
                placeholder="# Paste document content here"
                required
                value={content}
              />
            </label>

            <button
              className="w-full rounded-lg bg-slate-900 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Document List</h2>

            {documents.length === 0 ? (
              <p className="mt-4 text-slate-500">No documents yet.</p>
            ) : (
              <div className="mt-5 grid gap-4">
                {documents.map((document) => (
                  <Link
                    className="block rounded-lg border p-4 hover:bg-slate-50"
                    key={document.id}
                    to={`/projects/${projectId}/documents/${document.id}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{document.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {document.content}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Updated{" "}
                          {new Date(document.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {document.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="mt-4 max-w-none rounded-lg border bg-slate-50 p-4 text-sm">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-slate-500">Markdown preview appears here.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
