import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Decision, DecisionCreatePayload } from "../types/decision";
import type { Project } from "../types/project";

const STATUSES = ["PROPOSED", "ACCEPTED", "REPLACED", "DEPRECATED"];

export default function DecisionsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [title, setTitle] = useState("Use PostgreSQL and pgvector for project memory");
  const [status, setStatus] = useState("ACCEPTED");
  const [context, setContext] = useState(
    "DevMemory AI needs to store relational project data and also support vector search for project-aware retrieval.",
  );
  const [decisionText, setDecisionText] = useState(
    "Use PostgreSQL as the primary database and pgvector for embeddings and vector similarity search.",
  );
  const [alternatives, setAlternatives] = useState(
    "MongoDB with a separate vector database, SQLite for local development, or a hosted vector database such as Pinecone.",
  );
  const [consequences, setConsequences] = useState(
    "This keeps relational and vector data in one system, simplifying the MVP. The trade-off is that pgvector setup is required.",
  );
  const [aiDraft, setAiDraft] = useState("AI ADR draft will be generated later.");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const acceptedCount = useMemo(
    () => decisions.filter((item) => item.status === "ACCEPTED").length,
    [decisions],
  );

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      const [projectResponse, decisionsResponse] = await Promise.all([
        apiClient.get<Project>(`/api/projects/${projectId}`),
        apiClient.get<Decision[]>(`/api/projects/${projectId}/decisions`, {
          params: {
            status_filter: statusFilter || undefined,
          },
        }),
      ]);

      setProject(projectResponse.data);
      setDecisions(decisionsResponse.data);
      setError("");
    } catch {
      setError("Could not load architecture decisions.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) return;

    setIsCreating(true);
    setError("");

    const payload: DecisionCreatePayload = {
      title,
      status,
      context,
      decision: decisionText,
      alternatives: alternatives || null,
      consequences: consequences || null,
      ai_draft: aiDraft || null,
    };

    try {
      await apiClient.post<Decision>(`/api/projects/${projectId}/decisions`, payload);
      await loadData();
      setTitle("");
      setStatus("PROPOSED");
      setContext("");
      setDecisionText("");
      setAlternatives("");
      setConsequences("");
      setAiDraft("");
    } catch {
      setError("Could not create this architecture decision.");
    } finally {
      setIsCreating(false);
    }
  }

  function clearFilter() {
    setStatusFilter("");
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Architecture Decisions</h1>
        <p className="mt-2 text-slate-600">
          {project
            ? `Record architecture choices for ${project.name}.`
            : "Record why important technical decisions were made."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
        <section className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">New Decision</h2>
          <p className="mt-1 text-sm text-slate-500">
            Capture the context, choice, alternatives, and trade-offs.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreate}>
            <TextInput label="Title" onChange={setTitle} required value={title} />

            <SelectField
              label="Status"
              onChange={setStatus}
              options={STATUSES}
              value={status}
            />

            <TextAreaField
              label="Context"
              minHeight="min-h-32"
              onChange={setContext}
              required
              value={context}
            />
            <TextAreaField
              label="Decision"
              minHeight="min-h-32"
              onChange={setDecisionText}
              required
              value={decisionText}
            />
            <TextAreaField
              label="Alternatives"
              onChange={setAlternatives}
              value={alternatives}
            />
            <TextAreaField
              label="Consequences"
              onChange={setConsequences}
              value={consequences}
            />
            <TextAreaField
              label="AI Draft Placeholder"
              onChange={setAiDraft}
              value={aiDraft}
            />

            <button
              className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-60"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? "Creating..." : "Create Decision"}
            </button>
          </form>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Project Decisions</h2>
              <p className="mt-1 text-sm text-slate-500">
                {acceptedCount} accepted decision(s) in the current result set.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[180px_auto]">
              <select
                className="rounded-lg border px-3 py-2"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="">All statuses</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                className="rounded-lg border px-4 py-2"
                onClick={clearFilter}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 text-slate-500">Loading decisions...</p>
          ) : decisions.length === 0 ? (
            <p className="mt-6 text-slate-500">
              No architecture decisions found. Create the first ADR.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {decisions.map((decisionRecord) => (
                <Link
                  className="block rounded-lg border p-5 hover:bg-slate-50"
                  key={decisionRecord.id}
                  to={`/projects/${projectId}/decisions/${decisionRecord.id}`}
                >
                  <Badge label={decisionRecord.status} />
                  <h3 className="mt-3 text-lg font-semibold">
                    {decisionRecord.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {decisionRecord.context}
                  </p>
                  <p className="mt-4 text-xs text-slate-400">
                    Updated {new Date(decisionRecord.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded-lg border px-4 py-2"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border px-4 py-2"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  minHeight = "min-h-24",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className={`mt-1 w-full rounded-lg border px-4 py-2 ${minHeight}`}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
      {label}
    </span>
  );
}
