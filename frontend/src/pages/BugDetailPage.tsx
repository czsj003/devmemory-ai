import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Bug, BugUpdatePayload } from "../types/bug";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["OPEN", "INVESTIGATING", "FIXED", "ARCHIVED"];

export default function BugDetailPage() {
  const { projectId, bugId } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState<Bug | null>(null);
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [status, setStatus] = useState("OPEN");
  const [techStack, setTechStack] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [logs, setLogs] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [fixSummary, setFixSummary] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBug() {
      if (!projectId || !bugId) return;

      try {
        const response = await apiClient.get<Bug>(
          `/api/projects/${projectId}/bugs/${bugId}`,
        );
        setBug(response.data);
        setTitle(response.data.title);
        setSeverity(response.data.severity);
        setStatus(response.data.status);
        setTechStack(response.data.tech_stack ?? "");
        setErrorMessage(response.data.error_message ?? "");
        setLogs(response.data.logs ?? "");
        setRootCause(response.data.root_cause ?? "");
        setFixSummary(response.data.fix_summary ?? "");
        setAiAnalysis(response.data.ai_analysis ?? "");
      } catch {
        setError("Could not load this bug record.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBug();
  }, [projectId, bugId]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId || !bugId) return;

    setIsSaving(true);
    setError("");

    const payload: BugUpdatePayload = {
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
      const response = await apiClient.put<Bug>(
        `/api/projects/${projectId}/bugs/${bugId}`,
        payload,
      );
      setBug(response.data);
      setIsEditing(false);
    } catch {
      setError("Could not save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !bugId) return;

    const shouldDelete = window.confirm("Delete this bug record?");
    if (!shouldDelete) return;

    try {
      await apiClient.delete(`/api/projects/${projectId}/bugs/${bugId}`);
      navigate(`/projects/${projectId}/bugs`);
    } catch {
      setError("Could not delete this bug record.");
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading bug...</p>;
  }

  if (error && !bug) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">Bug not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}/bugs`}>
        Back to Bug Memory
      </Link>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge label={bug.severity} />
              <Badge label={bug.status} />
            </div>
            <h1 className="mt-3 text-3xl font-bold">{bug.title}</h1>
            <p className="mt-2 text-slate-500">
              Updated {new Date(bug.updated_at).toLocaleDateString()}
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
        <form className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSave}>
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
            minHeight="min-h-36"
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
            className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <InfoSection title="Error Message" content={bug.error_message} />
            <InfoSection title="Logs" content={bug.logs} />
            <InfoSection title="Root Cause" content={bug.root_cause} />
            <InfoSection title="Fix Summary" content={bug.fix_summary} />
          </section>

          <aside className="space-y-4">
            <InfoCard title="Tech Stack" content={bug.tech_stack} />
            <InfoCard title="AI Analysis" content={bug.ai_analysis} />
            <InfoCard
              title="Interview Talking Point"
              content="Explain the symptom, root cause, debugging process, and final fix. This placeholder can later be generated by AI."
            />
          </aside>
        </div>
      )}
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

function InfoSection({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
        {content || "Not added yet."}
      </p>
    </div>
  );
}

function InfoCard({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {content || "Not added yet."}
      </p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
      {label}
    </span>
  );
}
