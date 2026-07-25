import apiService from "./apiService.js";

// A dedicated service for Project-related API calls, built on top of
// the generic apiService. Pages import THIS, not apiService directly —
// so if the Project API's shape ever changes, there's exactly one file
// to update, not every page that happens to use projects.
const projectService = {
  getAll: () => apiService.get("/projects"),
  getById: (id) => apiService.get(`/projects/${id}`),
  create: (data) => apiService.post("/projects", data),
  update: (id, data) => apiService.put(`/projects/${id}`, data),
  delete: (id) => apiService.delete(`/projects/${id}`),
};

export default projectService;