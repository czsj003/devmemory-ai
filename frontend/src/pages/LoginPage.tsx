import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from || "/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Login</h1>
        <p className="mb-6 text-slate-600">Sign in to DevMemory AI.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border px-4 py-2"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <input
            className="w-full rounded-lg border px-4 py-2"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            className="w-full rounded-lg bg-slate-900 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New here?{" "}
          <Link className="font-medium text-slate-950" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
