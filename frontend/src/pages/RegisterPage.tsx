import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-slate-600">Start building your project memory.</p>

        <div className="space-y-4">
          <input className="w-full rounded-lg border px-4 py-2" placeholder="Name" />
          <input className="w-full rounded-lg border px-4 py-2" placeholder="Email" />
          <input
            className="w-full rounded-lg border px-4 py-2"
            placeholder="Password"
            type="password"
          />
          <button className="w-full rounded-lg bg-slate-900 py-2 text-white">
            Register
          </button>
        </div>

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
