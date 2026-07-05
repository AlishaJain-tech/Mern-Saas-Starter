import AppRoutes from "./routes/AppRoutes.jsx";

// App.jsx is the single root component of the application.
// Right now it just renders the route tree, but this is also
// where GLOBAL, app-wide providers will wrap everything later —
// e.g. <AuthProvider>, <TenantProvider>, a toast notification
// provider, etc. Keeping it as a thin wrapper now makes it easy
// to add those later without restructuring anything.
function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppRoutes />
    </div>
  );
}

export default App;