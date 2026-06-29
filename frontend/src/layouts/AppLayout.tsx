import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="hidden w-64 bg-slate-950 p-6 text-white md:flex md:flex-col">
        <div>
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
        </div>

        <div className="mt-auto border-t border-slate-800 pt-5">
          <p className="truncate text-sm text-slate-300">{user?.email}</p>
          <button
            className="mt-3 rounded bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
