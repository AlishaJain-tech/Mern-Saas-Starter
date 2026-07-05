import mongoose from "mongoose";

// A User is always tied to exactly ONE Tenant via the `tenant` field below.
// This single reference is the foundation of our entire multi-tenancy
// strategy: every query for "give me the users" will actually mean
// "give me the users WHERE tenant = req.user.tenant" once auth exists.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Stored as a hashed string later (Day 5, when we add bcrypt).
    // `select: false` means this field is excluded from query results
    // by default — you have to explicitly ask for it (e.g. during login),
    // so it never accidentally gets sent to the frontend.
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // Role WITHIN their tenant. "admin" can manage that tenant's
    // settings/users; "member" has regular access. This is separate
    // from any future "platform-level" admin/superadmin concept.
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    // The critical multi-tenancy link — which Tenant this user belongs to.
    // `ref: "Tenant"` lets Mongoose "populate" the full tenant document
    // later when needed (e.g. user.tenant.name).
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "A user must belong to a tenant"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;