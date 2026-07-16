import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // "create" = starting a brand new company/tenant (becomes admin)
  // "join"   = joining an existing tenant by its slug (becomes member)
  // This matches exactly what the backend's /api/auth/register expects.
  const [mode, setMode] = useState("create");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tenantName: "",
    tenantSlug: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mode,
        tenantSlug: formData.tenantSlug,
        // Only include tenantName when creating — the backend doesn't
        // need it (or want it) for the "join" flow.
        ...(mode === "create" && { tenantName: formData.tenantName }),
      };

      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-slate-900 text-center mb-6">
          Create your account
        </h1>

        {/* Toggle between starting a new company vs joining one that
            already exists — mirrors the backend's "create"/"join" modes. */}
        <div className="flex rounded-md border border-slate-300 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "create" ? "bg-brand-dark text-white" : "text-slate-600"
            }`}
          >
            New company
          </button>
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "join" ? "bg-brand-dark text-white" : "text-slate-600"
            }`}
          >
            Join existing
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          {mode === "create" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company name
              </label>
              <input
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {mode === "create" ? "Company slug (unique)" : "Company slug to join"}
            </label>
            <input
              type="text"
              name="tenantSlug"
              value={formData.tenantSlug}
              onChange={handleChange}
              required
              placeholder="acme-corp"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-dark font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;