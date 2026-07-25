import apiService from "./apiService.js";

// Matches the backend's tenant-scoped endpoints exactly: there's no
// "get tenant by id" anymore (see Day 6+ backend lockdown) — only
// "get/update MY OWN tenant", since that's the only thing a regular
// user should ever be able to do.
const tenantService = {
  getMine: () => apiService.get("/tenants/me"),
  updateMine: (data) => apiService.put("/tenants/me", data),
};

export default tenantService;