import mongoose from "mongoose";

// A Task belongs to exactly one Project, which in turn belongs to
// exactly one Tenant. We store BOTH `tenant` and `project` on the Task
// (not just `project`) — this is a deliberate choice, not redundancy:
// it means every Task query can filter directly by tenant WITHOUT
// first having to look up its parent Project. That keeps tenant
// isolation simple and fast to check at every single layer.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which Project this task belongs to. Required — a task can never
    // exist outside of a project in this design.
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // See the comment at the top of the file — stored directly here
    // as well as on Project, for simpler/faster tenant-scoped queries.
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;