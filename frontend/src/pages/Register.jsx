import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const ok = await register(email, password);
    setSubmitting(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 mb-3">
            <Car size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Register to browse and manage vehicles</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-7 rounded-2xl shadow-md border border-slate-100 space-y-4">
          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
              <CheckCircle2 size={15} className="shrink-0" /> Account created — redirecting to login...
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
            <p className="text-xs text-slate-400 mt-1">At least 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-slate-500 text-center pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
