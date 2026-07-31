import apiService from "./apiService.js";

// Wraps the two AI endpoints built on the backend. Kept as its own
// service (rather than folded into taskService/projectService) since
// these calls are conceptually different — they don't fetch/mutate a
// resource, they generate NEW content from one.
const aiService = {
  generateTaskDescription: (title) =>
    apiService.post("/ai/task-description", { title }),

  generateProjectSummary: (projectId) =>
    apiService.post(`/ai/projects/${projectId}/summary`),
};

export default aiService;