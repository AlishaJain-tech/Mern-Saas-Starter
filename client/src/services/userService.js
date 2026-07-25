import apiService from "./apiService.js";

// Only what's needed right now: fetching the current tenant's team
// members, used to populate the "assign task to" dropdown. More
// user-management functions (invite, update, remove) can be added here
// later without touching anything that already uses this file.
const userService = {
  getAll: () => apiService.get("/users"),
};

export default userService;