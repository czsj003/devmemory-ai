const stats = [
  { label: "Total Projects", value: 0 },
  { label: "Active Projects", value: 0 },
  { label: "Total Notes", value: 0 },
  { label: "Open Bugs", value: 0 },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Overview of your project memory workspaces.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div className="rounded-lg bg-white p-5 shadow" key={stat.label}>
            <p className="text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
