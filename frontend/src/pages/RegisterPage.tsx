import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate("/login");
    } catch {
      setError("Could not create this account. The email may already be used.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-slate-600">Start building your project memory.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border px-4 py-2"
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            required
            value={name}
          />
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
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-slate-950" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
