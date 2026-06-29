import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Project } from "../types/project";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await apiClient.get<Project[]>("/api/projects");
        setProjects(response.data);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const activeProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS",
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Overview of your project memory workspaces.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Projects" value={isLoading ? "..." : projects.length} />
        <StatCard
          label="Active Projects"
          value={isLoading ? "..." : activeProjects.length}
        />
        <StatCard label="Total Notes" value="0" />
        <StatCard label="Open Bugs" value="0" />
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Link className="text-sm text-slate-700 underline" to="/projects">
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No projects yet. Create your first project workspace.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {projects.slice(0, 5).map((project) => (
              <Link
                className="block rounded-lg border p-4 hover:bg-slate-50"
                key={project.id}
                to={`/projects/${project.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-slate-500">
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
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
