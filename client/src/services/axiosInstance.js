import axios from "axios";

// A single, pre-configured Axios instance used across the ENTIRE app.
// Every request automatically goes to the backend's base URL, so no
// component or service ever needs to type out "http://localhost:5000/..."
// itself.
//
// The base URL comes from an environment variable (see .env.example),
// so switching between local development and a deployed backend later
// is just a one-line config change — not a code change.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// This is also the natural place to add request/response interceptors
// later — e.g. automatically attaching a JWT token to every request,
// or redirecting to /login on a 401 response.

// REQUEST interceptor: runs before every outgoing request. Attaches the
// saved JWT (if one exists) as an Authorization header automatically —
// so no component or service ever needs to remember to do this itself.
axiosInstance.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// RESPONSE interceptor: runs after every response. If the backend ever
// says 401 (token missing/invalid/expired), clear the stored token so
// the app doesn't keep sending a dead token on every future request.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;