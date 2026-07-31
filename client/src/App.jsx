import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";

// App.jsx is the single root component of the application.
// AuthProvider and ToastProvider wrap EVERYTHING so that any component,
// anywhere in the tree, can call useAuth() or useToast() without
// prop-drilling.
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <AppRoutes />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
