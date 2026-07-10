import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { AISummary } from "../types/aiSummary";
import type { ProjectOverview } from "../types/projectOverview";

const featureCards = [
  {
    title: "Documents",
    description:
      "Store README, specs, API docs, database notes, deployment notes, and logs.",
    path: "documents",
  },
  {
    title: "Semantic Search",
    description: "Search indexed project memory using vector similarity.",
    path: "search",
  },
  {
    title: "AI Chat",
    description: "Ask project-aware questions and view source-backed responses.",
    path: "chat",
  },
  {
    title: "Daily Notes",
    description: "Record daily progress, completed tasks, blockers, and next steps.",
    path: "notes",
  },
  {
    title: "Bug Memory",
    description: "Track bugs, error logs, root causes, fixes, and debugging notes.",
    path: "bugs",
  },
  {
    title: "Architecture Decisions",
    description: "Record architecture choices, alternatives, and trade-offs.",
    path: "decisions",
  },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await apiClient.get<ProjectOverview>(
          `/api/projects/${projectId}/overview`,
        );
        setOverview(response.data);
        setSummary(response.data.latest_summary);
      } catch {
        setError("Project not found.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOverview();
  }, [projectId]);

  const memoryScore = useMemo(() => {
    if (!overview) return 0;

    const coverageValues = Object.values(overview.coverage);
    const readyCount = coverageValues.filter(Boolean).length;

    return Math.round((readyCount / coverageValues.length) * 100);
  }, [overview]);

  async function handleGenerateSummary() {
    if (!projectId) return;

    setError("");
    setIsGeneratingSummary(true);

    try {
      const response = await apiClient.post<AISummary>(
        `/api/projects/${projectId}/summary/generate`,
      );

      setSummary(response.data);

      const overviewResponse = await apiClient.get<ProjectOverview>(
        `/api/projects/${projectId}/overview`,
      );
      setOverview(overviewResponse.data);
      setSummary(overviewResponse.data.latest_summary ?? response.data);
    } catch {
      setError("Could not generate AI summary. Check your OpenAI API key and backend logs.");
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading project...</p>;
  }

  if (error && !overview) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Project not found</h1>
        <p className="mt-2 text-slate-600">{error}</p>
        <Link className="mt-6 inline-block text-slate-900 underline" to="/projects">
          Back to projects
        </Link>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const { project } = overview;

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to="/projects">
        Back to projects
      </Link>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                {project.description || "No description added yet."}
              </p>
            </div>

            <Badge label={project.status} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoItem label="Tech Stack" value={project.tech_stack} />
            <InfoItem label="Repository" value={project.repo_url} />
            <InfoItem label="Live App" value={project.live_url} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm font-medium text-slate-500">Memory Coverage</p>
          <p className="mt-2 text-4xl font-bold">{memoryScore}%</p>
          <p className="mt-2 text-sm text-slate-500">
            Based on documents, notes, bugs, decisions, and AI summary.
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Documents" value={overview.counts.documents_count} />
        <StatCard label="Notes" value={overview.counts.notes_count} />
        <StatCard label="Bugs" value={overview.counts.bugs_count} />
        <StatCard label="Open Bugs" value={overview.counts.open_bugs_count} />
        <StatCard label="Decisions" value={overview.counts.decisions_count} />
        <StatCard label="AI Summaries" value={overview.counts.summaries_count} />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">AI Project Summary</h2>
              <p className="mt-1 text-sm text-slate-500">
                Generated from project documents, notes, bugs, and decisions.
              </p>
            </div>

            <button
              className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
              disabled={isGeneratingSummary}
              onClick={handleGenerateSummary}
              type="button"
            >
              {isGeneratingSummary ? "Generating..." : "Generate Summary"}
            </button>
          </div>

          {summary ? (
            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <p className="whitespace-pre-wrap leading-7 text-slate-700">
                {summary.content}
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Generated {new Date(summary.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed p-6">
              <p className="text-slate-500">
                No AI summary yet. Click Generate Summary to create one using OpenAI.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Memory Coverage</h2>
          <div className="mt-5 space-y-3">
            <CoverageItem label="Documents" active={overview.coverage.has_documents} />
            <CoverageItem label="Daily Notes" active={overview.coverage.has_notes} />
            <CoverageItem label="Bug Memory" active={overview.coverage.has_bugs} />
            <CoverageItem
              label="Architecture Decisions"
              active={overview.coverage.has_decisions}
            />
            <CoverageItem label="AI Summary" active={overview.coverage.has_ai_summary} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((feature) => (
          <FeatureCard
            description={feature.description}
            key={feature.path}
            title={feature.title}
            to={`/projects/${project.id}/${feature.path}`}
          />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentList
          emptyText="No documents yet."
          items={overview.latest_documents.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.type,
            to: `/projects/${project.id}/documents/${item.id}`,
          }))}
          title="Recent Documents"
        />

        <RecentList
          emptyText="No daily notes yet."
          items={overview.latest_notes.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.note_date || "No date",
            to: `/projects/${project.id}/notes/${item.id}`,
          }))}
          title="Recent Daily Notes"
        />

        <RecentList
          emptyText="No bugs yet."
          items={overview.latest_bugs.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: `${item.severity} - ${item.status}`,
            to: `/projects/${project.id}/bugs/${item.id}`,
          }))}
          title="Recent Bugs"
        />

        <RecentList
          emptyText="No decisions yet."
          items={overview.latest_decisions.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.status,
            to: `/projects/${project.id}/decisions/${item.id}`,
          }))}
          title="Recent Decisions"
        />
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 break-words font-medium">{value || "Not added"}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link className="block rounded-lg bg-white p-6 shadow hover:shadow-md" to={to}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
      {label}
    </span>
  );
}

function CoverageItem({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="text-sm">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs ${
          active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {active ? "Ready" : "Missing"}
      </span>
    </div>
  );
}

function RecentList({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: {
    id: number;
    title: string;
    subtitle: string;
    to: string;
  }[];
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-slate-500">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Link
              className="block rounded-lg border p-4 hover:bg-slate-50"
              key={item.id}
              to={item.to}
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
