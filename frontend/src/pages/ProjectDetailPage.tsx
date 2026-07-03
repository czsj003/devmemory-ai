import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Project } from "../types/project";

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
    title: "Daily Notes",
    description: "Track what you built, blockers, fixes, and next steps.",
    path: "notes",
  },
  {
    title: "Bug Memory",
    description: "Save error messages, logs, causes, fixes, and AI analysis.",
    path: "bugs",
  },
  {
    title: "Architecture Decisions",
    description: "Record why important technical choices were made.",
    path: "decisions",
  },
  {
    title: "AI Chat",
    description: "Ask project-aware questions and view source-backed responses.",
    path: "chat",
  },
  {
    title: "Interview Prep",
    description: "Generate project pitch, explanations, and resume bullets.",
    path: "interview-prep",
  },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await apiClient.get<Project>(`/api/projects/${projectId}`);
        setProject(response.data);
      } catch {
        setError("Project not found.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (isLoading) {
    return <p className="text-slate-600">Loading project...</p>;
  }

  if (error || !project) {
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

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to="/projects">
        Back to projects
      </Link>

      <div className="mt-4 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              {project.description || "No description added yet."}
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
            {project.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoItem label="Tech Stack" value={project.tech_stack} />
          <InfoItem label="Repository" value={project.repo_url} />
          <InfoItem label="Live App" value={project.live_url} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((feature) => (
          <FeatureCard
            description={feature.description}
            key={feature.path}
            title={feature.title}
            to={`/projects/${project.id}/${feature.path}`}
          />
        ))}
      </div>
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
