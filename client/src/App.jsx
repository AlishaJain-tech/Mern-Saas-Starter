import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// App.jsx is the single root component of the application.
// AuthProvider wraps EVERYTHING so that any component, anywhere in the
// tree — a page, a layout, a deeply nested component — can call
// useAuth() and know who's logged in, without prop-drilling.
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;