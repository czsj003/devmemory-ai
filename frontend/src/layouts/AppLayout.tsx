import { Link, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="hidden w-64 bg-slate-950 p-6 text-white md:block">
        <h1 className="mb-8 text-xl font-bold">DevMemory AI</h1>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              className="block rounded px-2 py-1 text-slate-200 hover:bg-slate-800 hover:text-white"
              key={item.to}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
