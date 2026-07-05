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

export default axiosInstance;