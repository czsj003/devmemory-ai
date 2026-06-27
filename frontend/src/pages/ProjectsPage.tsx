export default function ProjectsPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-slate-600">
            Manage your project memory workspaces.
          </p>
        </div>

        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          New Project
        </button>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <p className="text-slate-500">No projects yet.</p>
      </div>
    </div>
  );
}
