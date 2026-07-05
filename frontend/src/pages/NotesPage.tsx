import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { DailyNote, DailyNoteCreatePayload } from "../types/dailyNote";
import type { Project } from "../types/project";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export default function NotesPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [title, setTitle] = useState("Day 7 - Daily Notes");
  const [noteDate, setNoteDate] = useState(getTodayDateString());
  const [content, setContent] = useState(
    "Today I implemented Daily Development Notes for DevMemory AI.",
  );
  const [completedTasks, setCompletedTasks] = useState(
    "Created DailyNote model, schemas, API routes, and frontend notes page.",
  );
  const [blockers, setBlockers] = useState(
    "No major blocker. Need to decide later how notes will be indexed for semantic search.",
  );
  const [nextSteps, setNextSteps] = useState("Continue with Bug Memory on Day 8.");
  const [aiSummary, setAiSummary] = useState(
    "Development-mode placeholder summary.",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      const [projectResponse, notesResponse] = await Promise.all([
        apiClient.get<Project>(`/api/projects/${projectId}`),
        apiClient.get<DailyNote[]>(`/api/projects/${projectId}/notes`),
      ]);

      setProject(projectResponse.data);
      setNotes(notesResponse.data);
      setError("");
    } catch {
      setError("Could not load daily notes.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) return;

    setIsCreating(true);
    setError("");

    const payload: DailyNoteCreatePayload = {
      title,
      note_date: noteDate || null,
      content,
      completed_tasks: completedTasks || null,
      blockers: blockers || null,
      next_steps: nextSteps || null,
      ai_summary: aiSummary || null,
    };

    try {
      const response = await apiClient.post<DailyNote>(
        `/api/projects/${projectId}/notes`,
        payload,
      );
      setNotes((currentNotes) => [response.data, ...currentNotes]);
      setTitle("");
      setContent("");
      setCompletedTasks("");
      setBlockers("");
      setNextSteps("");
      setAiSummary("");
      setNoteDate(getTodayDateString());
    } catch {
      setError("Could not create this daily note.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Daily Notes</h1>
        <p className="mt-2 text-slate-600">
          {project
            ? `Record daily progress for ${project.name}.`
            : "Track what you built, blockers, and next steps."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">New Daily Note</h2>
          <p className="mt-1 text-sm text-slate-500">
            Capture progress, blockers, and the next clear step.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreate}>
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
            <TextAreaField
              label="Next Steps"
              onChange={setNextSteps}
              value={nextSteps}
            />
            <TextAreaField
              label="AI Summary Placeholder"
              onChange={setAiSummary}
              value={aiSummary}
            />

            <button
              className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-60"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? "Creating..." : "Create Note"}
            </button>
          </form>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Your Daily Notes</h2>

          {isLoading ? (
            <p className="mt-6 text-slate-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="mt-6 text-slate-500">
              No daily notes yet. Create your first development log.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {notes.map((note) => (
                <Link
                  className="block rounded-lg border p-5 hover:bg-slate-50"
                  key={note.id}
                  to={`/projects/${projectId}/notes/${note.id}`}
                >
                  <p className="text-sm text-slate-500">
                    {note.note_date || "No date"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{note.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {note.content}
                  </p>
                  <p className="mt-4 text-xs text-slate-400">
                    Updated {new Date(note.updated_at).toLocaleDateString()}
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
