import { Link } from "react-router-dom";

// Rendered when NO route in AppRoutes.jsx matches the current URL (see
// the catch-all <Route path="*" /> we're adding there). Without this,
// an unmatched URL just renders nothing — a confusing blank screen
// instead of a clear "you've gone somewhere that doesn't exist."
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-brand-dark">404</p>
      <h1 className="text-xl font-semibold text-slate-900 mt-4">Page not found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-brand-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark-hover transition-colors"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFound;