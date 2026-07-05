import axiosInstance from "./axiosInstance.js";

// A thin wrapper around axiosInstance's HTTP methods.
//
// Why bother, if it just calls axiosInstance underneath?
// Because pages/components should import apiService, not axiosInstance,
// directly. That gives us ONE place to later add things like logging,
// automatic retries, or reshaping every response — without touching
// any component that already uses apiService.
//
// Later, feature-specific services (e.g. userService.js, tenantService.js)
// will be built ON TOP of this file — e.g.:
//   const getUsers = () => apiService.get('/users');
const apiService = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export default apiService;