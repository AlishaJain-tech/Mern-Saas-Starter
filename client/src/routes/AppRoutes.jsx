import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Projects from "../pages/Projects.jsx";
import ProjectDetail from "../pages/ProjectDetail.jsx";

// Centralizing all route definitions here (instead of scattering them
// across App.jsx or individual components) means there is exactly ONE
// place to look when you want to know "what pages does this app have,
// and what layout wraps each one?"
//
// Pattern used: a parent <Route> with a layout as its `element`, and
// child <Route>s as its pages. React Router renders the matching child
// wherever that layout places an <Outlet /> (see layouts/PublicLayout.jsx
// and layouts/DashboardLayout.jsx).
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public-facing routes — landing page, login, and register */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated app routes. ProtectedRoute checks AuthContext
          BEFORE DashboardLayout even renders — if there's no logged-in
          user, it redirects to /login instead. */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/projects/:id" element={<ProjectDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;