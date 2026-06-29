import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Project, ProjectCreate } from "../types/project";

const projectStatuses = ["PLANNING", "IN_PROGRESS", "DEPLOYED", "ARCHIVED"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProjectCreate>({
    name: "",
    description: "",
    tech_stack: "",
    status: "PLANNING",
    repo_url: "",
    live_url: "",
  });

  async function loadProjects() {
    const response = await apiClient.get<Project[]>("/api/projects");
    setProjects(response.data);
  }

  useEffect(() => {
    async function load() {
      try {
        await loadProjects();
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  function updateField<K extends keyof ProjectCreate>(
    field: K,
    value: ProjectCreate[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload: ProjectCreate = {
      ...form,
      description: form.description || null,
      tech_stack: form.tech_stack || null,
      repo_url: form.repo_url || null,
      live_url: form.live_url || null,
    };

    try {
      await apiClient.post<Project>("/api/projects", payload);
      setForm({
        name: "",
        description: "",
        tech_stack: "",
        status: "PLANNING",
        repo_url: "",
        live_url: "",
      });
      await loadProjects();
    } catch {
      setError("Could not create project. Please check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-2 text-slate-600">
          Manage your project memory workspaces.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form className="rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">New Project</h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="DevMemory AI"
                required
                value={form.name}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-lg border px-3 py-2"
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="What this project is about"
                value={form.description ?? ""}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tech Stack</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) =>
                  updateField("tech_stack", event.target.value)
                }
                placeholder="React, FastAPI, PostgreSQL"
                value={form.tech_stack ?? ""}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => updateField("status", event.target.value)}
                value={form.status}
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Repo URL</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => updateField("repo_url", event.target.value)}
                placeholder="https://github.com/..."
                type="url"
                value={form.repo_url ?? ""}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Live URL</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(event) => updateField("live_url", event.target.value)}
                placeholder="https://..."
                type="url"
                value={form.live_url ?? ""}
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              className="w-full rounded-lg bg-slate-900 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Your Projects</h2>

          {isLoading ? (
            <p className="mt-4 text-slate-500">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="mt-4 text-slate-500">No projects yet.</p>
          ) : (
            <div className="mt-5 grid gap-4">
              {projects.map((project) => (
                <Link
                  className="block rounded-lg border p-5 hover:bg-slate-50"
                  key={project.id}
                  to={`/projects/${project.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {project.description || "No description yet."}
                      </p>
                      <p className="mt-3 text-sm text-slate-500">
                        {project.tech_stack || "No tech stack added."}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
