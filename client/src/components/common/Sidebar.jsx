import { Link } from "react-router-dom";

// Placeholder nav items — these will become real, permission-aware
// links once auth and tenant features exist. For now they just show
// the shape of a typical SaaS sidebar.
const navItems = [
  { label: "Overview", to: "/dashboard" },
  { label: "Tenants", to: "#" },
  { label: "Users", to: "#" },
  { label: "Settings", to: "#" },
];

// Sidebar is "dumb" — it doesn't own its open/closed state, it just
// receives `isOpen` and an `onClose` callback as props from
// DashboardLayout. This keeps it reusable and easy to test in isolation.
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Dark overlay behind the sidebar on mobile — tapping it closes the menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-brand-dark text-slate-100 flex flex-col
          transform transition-transform duration-200 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <span className="text-lg font-semibold tracking-tight">
            SaaS Starter
          </span>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;