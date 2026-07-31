import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import tenantService from "../services/tenantService.js";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await tenantService.getMine();
        setTenant(res.data.data);
        setName(res.data.data.name);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load company settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await tenantService.updateMine({ name });
      setTenant(res.data.data);
      setSuccessMessage("Saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return <p className="text-sm text-red-600">{error || "Company not found."}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Settings</h2>
      <p className="text-sm text-slate-500 mb-6">Your company's details.</p>

      <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isAdmin}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company slug
            </label>
            {/* Slug is never editable here — it was fixed at creation
                time on the backend, so the input is always disabled,
                regardless of role. Nothing to submit, just informational. */}
            <input
              type="text"
              value={tenant.slug}
              disabled
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-slate-50 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
            <p className="text-sm text-slate-600 capitalize">{tenant.plan}</p>
          </div>

          {!isAdmin && (
            <p className="text-xs text-slate-400">
              Only admins can change these settings.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          {isAdmin && (
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;