import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

// Wraps around routes that require a logged-in user (the dashboard).
// If there's no authenticated user, redirect to /login instead of
// rendering the protected content.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // While we're still checking localStorage/verifying the token with
  // the backend, show a simple loading state — otherwise we'd briefly
  // redirect to /login even for someone who IS logged in, just because
  // the check hadn't finished yet.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;