// Navbar is also "dumb" — it receives an `onMenuClick` callback to open
// the sidebar on mobile, but doesn't manage any state itself. This keeps
// it simple and easy to reuse or restyle later without touching logic.
const Navbar = ({ onMenuClick }) => {
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

      {/* Placeholder for a real user menu / avatar dropdown later */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand-accent flex items-center justify-center text-sm font-semibold text-white">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;