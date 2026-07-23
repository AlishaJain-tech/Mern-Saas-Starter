import mongoose from "mongoose";

// A Project belongs to exactly one Tenant (the team/company). Every
// Task will, in turn, belong to exactly one Project. This gives us a
// clean three-level hierarchy:
//
//   Tenant (the company)
//     └── Project (e.g. "Website Redesign")
//           └── Task (e.g. "Design the homepage")
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    // Who created this project — useful later for permissions
    // (e.g. only the creator or an admin can delete a project).
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The multi-tenancy link — same pattern as every other model.
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

const Project = mongoose.model("Project", projectSchema);

export default Project;