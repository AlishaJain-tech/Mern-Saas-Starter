
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
 
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
 
    // Stored as a bcrypt HASH, never as plain text — see the pre("save")
    // hook below, which hashes this automatically before saving.
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
 
// This runs automatically every time a User document is about to be
// saved (both on creation AND on updates that touch the password).
// Putting it HERE, on the model, means every path that creates/updates
// a user gets hashing for free — no controller can forget to call it.
userSchema.pre("save", async function () {
  // `this` is the user document being saved. If the password field
  // wasn't changed (e.g. we're just updating the user's name), skip
  // re-hashing — otherwise we'd hash an already-hashed password.
  if (!this.isModified("password")) {
    return;
  }

  // "Salt rounds" controls how much computational work hashing takes.
  // 10 is a solid, standard default — high enough to resist brute-force
  // guessing, low enough to not slow down your app noticeably.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // NOTE: no next() call here. Because this function is declared `async`,
  // Mongoose automatically waits for the returned Promise to resolve —
  // it does NOT pass in a next callback. Mixing next() with async/await
  // in the same hook is what caused the "next is not a function" error.
});
 
// An instance method — callable on any user document as
// `user.comparePassword(candidatePassword)`. Used during login to check
// a plain-text password attempt against the stored hash, without ever
// needing to "un-hash" anything (that's not possible, by design).
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
 
const User = mongoose.model("User", userSchema);
 
export default User;