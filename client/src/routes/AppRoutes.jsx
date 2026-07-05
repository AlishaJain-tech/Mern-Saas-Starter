import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";

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
      {/* Public-facing routes (landing page, later: login/signup) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Authenticated app routes (later: protected by auth middleware) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;