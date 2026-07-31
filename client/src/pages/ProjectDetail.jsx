import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import projectService from "../services/projectService.js";
import taskService from "../services/taskService.js";
import userService from "../services/userService.js";
import aiService from "../services/aiService.js";
import { useToast } from "../contexts/ToastContext.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const STATUS_OPTIONS = ["todo", "in-progress", "done"];
const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const ProjectDetail = () => {
  const { showToast } = useToast();
  // :id here matches the "/dashboard/projects/:id" route we're about
  // to add — this is the PROJECT's id, which every taskService call
  // below needs as its first argument.
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separate loading state just for the "Generate with AI" button on
  // the description field — distinct from isSubmitting (the whole form
  // submit), since generating a description and submitting the task
  // are two different actions that can each be in-flight independently.
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // State for the project-level AI summary panel — separate from
  // everything else on the page, since it's fetched on-demand (only
  // when the user clicks the button) rather than on page load.
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // Loads everything this page needs in parallel — the project itself,
  // its tasks, and the team list for the assignment dropdown.
  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        projectService.getById(projectId),
        taskService.getAll(projectId),
        userService.getAll(),
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setTeamMembers(usersRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Don't send an empty string for assignedTo — the backend expects
      // either a real user ID or the field left out entirely.
      const payload = {
        ...formData,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
      };

      await taskService.create(projectId, payload);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
      });
      setShowForm(false);
      showToast("Task created");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Changing a task's status is common enough that it gets its own
  // quick handler, separate from the full edit form (which we're not
  // building today — a status dropdown covers the main daily use case).
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(projectId, taskId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task.");
      showToast("Failed to update task", "error");
    }
  };

  // Uses whatever's currently typed in the title field to generate a
  // description via Gemini, then fills the description field with it —
  // the person can still edit it before submitting, this just saves
  // them from writing it from scratch.
  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setError("Type a task title first, then generate a description.");
      return;
    }

    setIsGeneratingDescription(true);
    setError("");

    try {
      const res = await aiService.generateTaskDescription(formData.title);
      setFormData((prev) => ({ ...prev, description: res.data.data.description }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate description.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError("");

    try {
      const res = await aiService.generateProjectSummary(projectId);
      setSummary(res.data.data.summary);
    } catch (err) {
      setSummaryError(err.response?.data?.message || "Failed to generate summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await taskService.delete(projectId, taskId);
      showToast("Task deleted");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task.");
      showToast("Failed to delete task", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return <p className="text-sm text-red-600">{error || "Project not found."}</p>;
  }

  return (
    <div>
      <Link to="/dashboard/projects" className="text-sm text-brand-dark hover:underline">
        ← Back to Projects
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
          {project.description && (
            <p className="text-sm text-slate-500 mt-1">{project.description}</p>
          )}
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Cancel" : "New Task"}
        </Button>
      </div>

      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800">✨ AI Project Summary</h3>
          <Button
            variant="secondary"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary
              ? "Thinking..."
              : summary
                ? "Regenerate"
                : "Generate Summary"}
          </Button>
        </div>

        {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}

        {summary && !isGeneratingSummary && (
          <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
        )}

        {!summary && !summaryError && !isGeneratingSummary && (
          <p className="text-sm text-slate-400">
            Get an AI-generated status summary of this project's tasks.
          </p>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="mb-6 p-4 bg-white border border-slate-200 rounded-lg space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription}
                className="text-xs font-medium text-brand-dark hover:underline disabled:opacity-50"
              >
                {isGeneratingDescription ? "Generating..." : "✨ Generate with AI"}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Due date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assign to
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create the first task to start tracking work on this project."
          action={<Button onClick={() => setShowForm(true)}>New Task</Button>}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${PRIORITY_STYLES[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                  {task.assignedTo && (
                    <span className="text-xs text-slate-500">
                      Assigned to {task.assignedTo.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-xs text-slate-500">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="text-xs rounded-md border border-slate-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task._id)}
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

export default ProjectDetail;