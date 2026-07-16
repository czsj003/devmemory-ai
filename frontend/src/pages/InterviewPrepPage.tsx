import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type {
  InterviewPrep,
  InterviewPrepGenerateResponse,
} from "../types/interviewPrep";
import type { Project } from "../types/project";

export default function InterviewPrepPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [focus, setFocus] = useState("backend engineering internship");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!projectId) return;

      setError("");
      setIsLoading(true);

      try {
        const [projectResponse, prepResponse] = await Promise.all([
          apiClient.get<Project>(`/api/projects/${projectId}`),
          apiClient.get<InterviewPrep | null>(
            `/api/projects/${projectId}/interview-prep/latest`,
          ),
        ]);

        setProject(projectResponse.data);
        setPrep(prepResponse.data);
      } catch {
        setError("Could not load interview prep.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  async function handleGenerate() {
    if (!projectId) return;

    setIsGenerating(true);
    setError("");
    setCopiedSection("");

    try {
      const response = await apiClient.post<InterviewPrepGenerateResponse>(
        `/api/projects/${projectId}/interview-prep/generate`,
        {
          focus: focus.trim() || null,
        },
      );

      setPrep(response.data.prep);
    } catch {
      setError(
        "Could not generate interview prep. Re-index project memory and check OpenAI API configuration.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard(title: string, text?: string | null) {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopiedSection(title);
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading interview prep...</p>;
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Prep</h1>
          <p className="mt-2 text-slate-600">
            {project
              ? `Turn ${project.name}'s memory into interview and resume material.`
              : "Generate interview material from project memory."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium">Source-based interview preparation</p>
        <p className="mt-1">
          This page uses project memory, bugs, and architecture decisions to
          generate project pitch, resume bullets, debugging stories, and STAR
          interview answers.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Generate Interview Prep</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a focus to tailor the output. Example: backend internship,
          full-stack role, AI engineering role.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto]">
          <input
            className="rounded-lg border px-4 py-2"
            onChange={(event) => setFocus(event.target.value)}
            placeholder="backend engineering internship"
            value={focus}
          />

          <button
            className="rounded-lg bg-slate-900 px-5 py-2 text-white disabled:opacity-60"
            disabled={isGenerating}
            onClick={handleGenerate}
            type="button"
          >
            {isGenerating ? "Generating..." : "Generate Prep"}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Tip: Add project notes, bugs, and decisions first, then re-index
          unified memory before generating interview prep.
        </p>
      </section>

      {!prep ? (
        <section className="mt-8 rounded-lg bg-white p-8 text-center shadow">
          <h2 className="text-xl font-semibold">No interview prep yet</h2>
          <p className="mt-2 text-slate-500">
            Generate a project pitch, technical explanation, resume bullets,
            debugging story, and STAR answer from unified project memory.
          </p>
        </section>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6">
          <PrepCard
            content={prep.project_pitch}
            copiedSection={copiedSection}
            onCopy={() => copyToClipboard("Project Pitch", prep.project_pitch)}
            title="Project Pitch"
          />

          <PrepCard
            content={prep.technical_explanation}
            copiedSection={copiedSection}
            onCopy={() =>
              copyToClipboard("Technical Explanation", prep.technical_explanation)
            }
            title="Technical Explanation"
          />

          <PrepCard
            content={prep.resume_bullets}
            copiedSection={copiedSection}
            onCopy={() => copyToClipboard("Resume Bullets", prep.resume_bullets)}
            title="Resume Bullets"
          />

          <PrepCard
            content={prep.debugging_story}
            copiedSection={copiedSection}
            onCopy={() => copyToClipboard("Debugging Story", prep.debugging_story)}
            title="Debugging Story"
          />

          <PrepCard
            content={prep.architecture_explanation}
            copiedSection={copiedSection}
            onCopy={() =>
              copyToClipboard(
                "Architecture Explanation",
                prep.architecture_explanation,
              )
            }
            title="Architecture Explanation"
          />

          <PrepCard
            content={prep.star_answer}
            copiedSection={copiedSection}
            onCopy={() => copyToClipboard("STAR Interview Answer", prep.star_answer)}
            title="STAR Interview Answer"
          />

          <p className="text-xs text-slate-400">
            Generated {new Date(prep.created_at).toLocaleString()}
          </p>
        </section>
      )}
    </div>
  );
}

function PrepCard({
  title,
  content,
  copiedSection,
  onCopy,
}: {
  title: string;
  content?: string | null;
  copiedSection: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>

        <button
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          disabled={!content}
          onClick={onCopy}
          type="button"
        >
          {copiedSection === title ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-5">
        <p className="whitespace-pre-wrap leading-7 text-slate-700">
          {content || "Not generated yet."}
        </p>
      </div>
    </div>
  );
}
