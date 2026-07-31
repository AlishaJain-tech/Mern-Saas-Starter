import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import userService from "../services/userService.js";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const Team = () => {
  // We need to know the CURRENT user's role and id — role decides
  // whether the invite form/remove buttons even show up, and id lets
  // us stop someone from seeing a "remove" button next to themselves.
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await userService.getAll();
      setMembers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Note: we never send a `role` here — the backend always forces
      // new invites to "member", the same server-side rule we tested
      // back when we locked down the User routes.
      await userService.create(formData);
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to invite teammate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this teammate? They will lose access immediately.")) {
      return;
    }

    try {
      await userService.delete(id);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove teammate.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Team</h2>
          <p className="text-sm text-slate-500 mt-1">
            Everyone in your organization.
          </p>
        </div>

        {/* Only admins can invite — a member visiting this page simply
            never sees the button, even though the backend would also
            reject the request if they somehow tried. Belt and suspenders. */}
        {isAdmin && (
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Cancel" : "Invite Teammate"}
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={handleInvite}
          className="mb-6 p-4 bg-white border border-slate-200 rounded-lg space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
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
              Temporary password
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inviting..." : "Invite"}
          </Button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
          {members.map((member) => (
            <div key={member._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {member.role}
                </span>

                {/* Never show "remove" next to your own row — deleting
                    your own account has its own dedicated flow (or
                    none yet), not this button. */}
                {isAdmin && member._id !== user.id && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;