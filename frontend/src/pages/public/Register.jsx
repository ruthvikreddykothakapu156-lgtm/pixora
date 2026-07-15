import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visitor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role });
      login(res.data.user, res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-text-muted">Join Pixora to book photographers or showcase your work.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("visitor")}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium ${
                role === "visitor"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("photographer")}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium ${
                role === "photographer"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted"
              }`}
            >
              Photographer
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent">
          Login
        </Link>
      </p>
    </div>
  );
}