import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

// Navbar now reads the logged-in user directly from AuthContext via
// useAuth() — no need to pass user data down as props from every parent.
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger button — only visible on mobile (md:hidden), since the
            sidebar is always visible on larger screens */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>

        <h1 className="text-base font-semibold text-slate-800">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 hidden sm:block">
          {user?.name}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Log out
        </button>

        <div className="h-9 w-9 rounded-full bg-brand-accent flex items-center justify-center text-sm font-semibold text-white">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default Navbar;