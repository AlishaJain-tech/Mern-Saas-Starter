import mongoose from "mongoose";
 
// A Tenant represents one company/organization using our SaaS.
// Every User will belong to exactly one Tenant (see User.js).
// Every future feature model (Projects, Tasks, etc.) will also
// reference a Tenant, so its data can be scoped and isolated.
const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
 
    // A URL-friendly unique identifier for the tenant, e.g. "acme-corp".
    // Useful later for tenant-specific URLs or subdomains
    // (e.g. acme-corp.yourapp.com), and as a human-readable unique key.
    slug: {
      type: String,
      required: [true, "Tenant slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
 
    // Simple plan field for now — will matter once billing/limits exist.
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  },
);
 
const Tenant = mongoose.model("Tenant", tenantSchema);
 
export default Tenant;