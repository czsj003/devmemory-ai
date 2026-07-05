import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { DailyNote, DailyNoteUpdatePayload } from "../types/dailyNote";

export default function NoteDetailPage() {
  const { projectId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<DailyNote | null>(null);
  const [title, setTitle] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [content, setContent] = useState("");
  const [completedTasks, setCompletedTasks] = useState("");
  const [blockers, setBlockers] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNote() {
      if (!projectId || !noteId) return;

      try {
        const response = await apiClient.get<DailyNote>(
          `/api/projects/${projectId}/notes/${noteId}`,
        );
        setNote(response.data);
        setTitle(response.data.title);
        setNoteDate(response.data.note_date ?? "");
        setContent(response.data.content);
        setCompletedTasks(response.data.completed_tasks ?? "");
        setBlockers(response.data.blockers ?? "");
        setNextSteps(response.data.next_steps ?? "");
        setAiSummary(response.data.ai_summary ?? "");
      } catch {
        setError("Could not load this daily note.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();
  }, [projectId, noteId]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId || !noteId) return;

    setIsSaving(true);
    setError("");

    const payload: DailyNoteUpdatePayload = {
      title,
      note_date: noteDate || null,
      content,
      completed_tasks: completedTasks || null,
      blockers: blockers || null,
      next_steps: nextSteps || null,
      ai_summary: aiSummary || null,
    };

    try {
      const response = await apiClient.put<DailyNote>(
        `/api/projects/${projectId}/notes/${noteId}`,
        payload,
      );
      setNote(response.data);
      setIsEditing(false);
    } catch {
      setError("Could not save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !noteId) return;

    const shouldDelete = window.confirm("Delete this daily note?");
    if (!shouldDelete) return;

    try {
      await apiClient.delete(`/api/projects/${projectId}/notes/${noteId}`);
      navigate(`/projects/${projectId}/notes`);
    } catch {
      setError("Could not delete this daily note.");
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading daily note...</p>;
  }

  if (error && !note) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">Daily note not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}/notes`}>
        Back to Daily Notes
      </Link>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{note.title}</h1>
            <p className="mt-2 text-slate-500">
              {note.note_date || "No date"} - Updated{" "}
              {new Date(note.updated_at).toLocaleDateString()}
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

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <input
              className="mt-1 w-full rounded-lg border px-4 py-2"
              onChange={(event) => setNoteDate(event.target.value)}
              type="date"
              value={noteDate}
            />
          </label>

          <TextAreaField
            label="Content"
            minHeight="min-h-36"
            onChange={setContent}
            required
            value={content}
          />
          <TextAreaField
            label="Completed Tasks"
            onChange={setCompletedTasks}
            value={completedTasks}
          />
          <TextAreaField label="Blockers" onChange={setBlockers} value={blockers} />
          <TextAreaField label="Next Steps" onChange={setNextSteps} value={nextSteps} />
          <TextAreaField
            label="AI Summary Placeholder"
            onChange={setAiSummary}
            value={aiSummary}
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
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Development Note</h2>
            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
              {note.content}
            </p>
          </section>

          <aside className="space-y-4">
            <InfoCard title="Completed Tasks" content={note.completed_tasks} />
            <InfoCard title="Blockers" content={note.blockers} />
            <InfoCard title="Next Steps" content={note.next_steps} />
            <InfoCard title="AI Summary" content={note.ai_summary} />
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
