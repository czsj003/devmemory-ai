import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Bug, BugCreatePayload } from "../types/bug";
import type { Project } from "../types/project";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["OPEN", "INVESTIGATING", "FIXED", "ARCHIVED"];

export default function BugsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [title, setTitle] = useState("Vercel refresh returns 404");
  const [severity, setSeverity] = useState("HIGH");
  const [status, setStatus] = useState("FIXED");
  const [techStack, setTechStack] = useState("React, Vite, React Router, Vercel");
  const [errorMessage, setErrorMessage] = useState(
    "Refreshing /dashboard returns 404 after deployment.",
  );
  const [logs, setLogs] = useState(
    "Browser shows Vercel 404 page. No backend error.",
  );
  const [rootCause, setRootCause] = useState(
    "Vercel was trying to serve /dashboard as a server route, but the app uses React Router client-side routing.",
  );
  const [fixSummary, setFixSummary] = useState(
    "Added a vercel.json rewrite rule to route all paths to index.html.",
  );
  const [aiAnalysis, setAiAnalysis] = useState("AI analysis will be generated later.");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const openBugCount = useMemo(
    () => bugs.filter((bug) => bug.status === "OPEN").length,
    [bugs],
  );

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      const [projectResponse, bugsResponse] = await Promise.all([
        apiClient.get<Project>(`/api/projects/${projectId}`),
        apiClient.get<Bug[]>(`/api/projects/${projectId}/bugs`, {
          params: {
            status_filter: statusFilter || undefined,
            severity_filter: severityFilter || undefined,
          },
        }),
      ]);

      setProject(projectResponse.data);
      setBugs(bugsResponse.data);
      setError("");
    } catch {
      setError("Could not load bugs.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, statusFilter, severityFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) return;

    setIsCreating(true);
    setError("");

    const payload: BugCreatePayload = {
      title,
      severity,
      status,
      tech_stack: techStack || null,
      error_message: errorMessage || null,
      logs: logs || null,
      root_cause: rootCause || null,
      fix_summary: fixSummary || null,
      ai_analysis: aiAnalysis || null,
    };

    try {
      await apiClient.post<Bug>(`/api/projects/${projectId}/bugs`, payload);
      await loadData();
      setTitle("");
      setTechStack("");
      setErrorMessage("");
      setLogs("");
      setRootCause("");
      setFixSummary("");
      setAiAnalysis("");
      setSeverity("MEDIUM");
      setStatus("OPEN");
    } catch {
      setError("Could not create this bug record.");
    } finally {
      setIsCreating(false);
    }
  }

  function clearFilters() {
    setStatusFilter("");
    setSeverityFilter("");
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Bug Memory</h1>
        <p className="mt-2 text-slate-600">
          {project
            ? `Track debugging history for ${project.name}.`
            : "Store bugs, error logs, root causes, and fixes."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
        <section className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">New Bug Record</h2>
          <p className="mt-1 text-sm text-slate-500">
            Capture the symptom, logs, root cause, and final fix.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreate}>
            <TextInput label="Title" onChange={setTitle} required value={title} />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Severity"
                onChange={setSeverity}
                options={SEVERITIES}
                value={severity}
              />
              <SelectField
                label="Status"
                onChange={setStatus}
                options={STATUSES}
                value={status}
              />
            </div>

            <TextAreaField
              label="Tech Stack"
              minHeight="min-h-16"
              onChange={setTechStack}
              value={techStack}
            />
            <TextAreaField
              label="Error Message"
              onChange={setErrorMessage}
              value={errorMessage}
            />
            <TextAreaField
              label="Logs"
              minHeight="min-h-32"
              onChange={setLogs}
              value={logs}
            />
            <TextAreaField
              label="Root Cause"
              onChange={setRootCause}
              value={rootCause}
            />
            <TextAreaField
              label="Fix Summary"
              onChange={setFixSummary}
              value={fixSummary}
            />
            <TextAreaField
              label="AI Analysis Placeholder"
              onChange={setAiAnalysis}
              value={aiAnalysis}
            />

            <button
              className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-60"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? "Creating..." : "Create Bug"}
            </button>
          </form>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Project Bugs</h2>
              <p className="mt-1 text-sm text-slate-500">
                {openBugCount} open bug(s) in the current result set.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[160px_160px_auto]">
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

              <select
                className="rounded-lg border px-3 py-2"
                onChange={(event) => setSeverityFilter(event.target.value)}
                value={severityFilter}
              >
                <option value="">All severities</option>
                {SEVERITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                className="rounded-lg border px-4 py-2"
                onClick={clearFilters}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 text-slate-500">Loading bugs...</p>
          ) : bugs.length === 0 ? (
            <p className="mt-6 text-slate-500">
              No bugs found. Create the first bug memory record.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {bugs.map((bug) => (
                <Link
                  className="block rounded-lg border p-5 hover:bg-slate-50"
                  key={bug.id}
                  to={`/projects/${projectId}/bugs/${bug.id}`}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge label={bug.severity} />
                    <Badge label={bug.status} />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{bug.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {bug.tech_stack || "No tech stack added"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {bug.error_message || "No error message added yet."}
                  </p>
                  <p className="mt-4 text-xs text-slate-400">
                    Updated {new Date(bug.updated_at).toLocaleDateString()}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className={`mt-1 w-full rounded-lg border px-4 py-2 ${minHeight}`}
        onChange={(event) => onChange(event.target.value)}
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
