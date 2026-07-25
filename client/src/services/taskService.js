import apiService from "./apiService.js";

// Every function here needs a `projectId` first, since tasks are always
// nested under a project on the backend (/api/projects/:projectId/tasks) —
// there's no such thing as a task that doesn't belong to a project, so
// the service's shape deliberately mirrors that.
const taskService = {
  getAll: (projectId, params = {}) =>
    apiService.get(`/projects/${projectId}/tasks`, { params }),

  getById: (projectId, taskId) =>
    apiService.get(`/projects/${projectId}/tasks/${taskId}`),

  create: (projectId, data) => apiService.post(`/projects/${projectId}/tasks`, data),

  update: (projectId, taskId, data) =>
    apiService.put(`/projects/${projectId}/tasks/${taskId}`, data),

  delete: (projectId, taskId) => apiService.delete(`/projects/${projectId}/tasks/${taskId}`),
};

export default taskService;