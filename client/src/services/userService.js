import apiService from "./apiService.js";

// Fetching the team, inviting a new teammate, and removing one — all
// the User-related calls the Team page needs. Note: `create` and
// `delete` will 403 on the backend if the logged-in user isn't an
// admin — the frontend just surfaces whatever the backend says rather
// than trying to duplicate that permission logic itself.
const userService = {
  getAll: () => apiService.get("/users"),
  create: (data) => apiService.post("/users", data),
  delete: (id) => apiService.delete(`/users/${id}`),
};

export default userService;