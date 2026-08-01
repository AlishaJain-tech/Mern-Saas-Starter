import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import projectService from "../services/projectService.js";
import { useToast } from "../contexts/ToastContext.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const Projects = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pulled out as its own function (not just inline in useEffect) so we
  // can also call it again after creating/deleting a project — refetch
  // instead of manually patching local state, keeping the UI always in
  // sync with what the backend actually has.
  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await projectService.getAll();
      setProjects(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await projectService.create(formData);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      showToast("Project created");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // A simple native confirm is fine for a portfolio project — a
    // proper custom modal can replace this later without changing
    // any of the logic around it.
    if (!window.confirm("Delete this project and all its tasks? This cannot be undone.")) {
      return;
    }

    try {
      await projectService.delete(id);
      showToast("Project deleted");
      fetchProjects();
    } catch (err) {
      // Most likely a 403 if you're not the creator/admin — the backend
      // enforces this, the frontend just surfaces whatever it says.
      setError(err.response?.data?.message || "Failed to delete project.");
      showToast("Failed to delete project", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize your team's work into projects.
          </p>
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)} className="self-start sm:self-auto">
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-white border border-slate-200 rounded-lg space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project name
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
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing your team's work."
          action={<Button onClick={() => setShowForm(true)}>New Project</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col"
            >
              <Link
                to={`/dashboard/projects/${project._id}`}
                className="font-medium text-slate-900 hover:text-brand-dark"
              >
                {project.name}
              </Link>

              {project.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {project.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(project._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;