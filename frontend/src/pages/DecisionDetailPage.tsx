import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Decision, DecisionUpdatePayload } from "../types/decision";

const STATUSES = ["PROPOSED", "ACCEPTED", "REPLACED", "DEPRECATED"];

export default function DecisionDetailPage() {
  const { projectId, decisionId } = useParams();
  const navigate = useNavigate();
  const [decisionRecord, setDecisionRecord] = useState<Decision | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("PROPOSED");
  const [context, setContext] = useState("");
  const [decisionText, setDecisionText] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [consequences, setConsequences] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDecision() {
      if (!projectId || !decisionId) return;

      try {
        const response = await apiClient.get<Decision>(
          `/api/projects/${projectId}/decisions/${decisionId}`,
        );
        setDecisionRecord(response.data);
        setTitle(response.data.title);
        setStatus(response.data.status);
        setContext(response.data.context);
        setDecisionText(response.data.decision);
        setAlternatives(response.data.alternatives ?? "");
        setConsequences(response.data.consequences ?? "");
        setAiDraft(response.data.ai_draft ?? "");
      } catch {
        setError("Could not load this architecture decision.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDecision();
  }, [projectId, decisionId]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId || !decisionId) return;

    setIsSaving(true);
    setError("");

    const payload: DecisionUpdatePayload = {
      title,
      status,
      context,
      decision: decisionText,
      alternatives: alternatives || null,
      consequences: consequences || null,
      ai_draft: aiDraft || null,
    };

    try {
      const response = await apiClient.put<Decision>(
        `/api/projects/${projectId}/decisions/${decisionId}`,
        payload,
      );
      setDecisionRecord(response.data);
      setIsEditing(false);
    } catch {
      setError("Could not save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !decisionId) return;

    const shouldDelete = window.confirm("Delete this architecture decision?");
    if (!shouldDelete) return;

    try {
      await apiClient.delete(`/api/projects/${projectId}/decisions/${decisionId}`);
      navigate(`/projects/${projectId}/decisions`);
    } catch {
      setError("Could not delete this architecture decision.");
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading architecture decision...</p>;
  }

  if (error && !decisionRecord) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!decisionRecord) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">Architecture decision not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        className="text-sm text-slate-600 underline"
        to={`/projects/${projectId}/decisions`}
      >
        Back to Architecture Decisions
      </Link>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge label={decisionRecord.status} />
            <h1 className="mt-3 text-3xl font-bold">{decisionRecord.title}</h1>
            <p className="mt-2 text-slate-500">
              Updated {new Date(decisionRecord.updated_at).toLocaleDateString()}
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
            <InfoSection title="Context" content={decisionRecord.context} />
            <InfoSection title="Decision" content={decisionRecord.decision} />
            <InfoSection title="Alternatives" content={decisionRecord.alternatives} />
            <InfoSection title="Consequences" content={decisionRecord.consequences} />
          </section>

          <aside className="space-y-4">
            <InfoCard title="AI Draft" content={decisionRecord.ai_draft} />
            <InfoCard
              title="Interview Talking Point"
              content="Explain the problem, the decision, the alternatives, and the trade-offs. This is exactly what interviewers want to hear when asking about architecture choices."
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
