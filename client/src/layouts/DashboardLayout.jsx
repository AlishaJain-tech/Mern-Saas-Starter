import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import useToggle from "../hooks/useToggle.js";

// The layout used for every authenticated/app page (dashboard, settings,
// tenant management, etc). It arranges three regions:
//
//   ┌─────────────┬───────────────────────┐
//   │             │        Navbar         │
//   │   Sidebar   ├───────────────────────┤
//   │             │     Main Content      |
//   │             │      (<Outlet />)     │
//   └─────────────┴───────────────────────┘
//
// On mobile, the sidebar is hidden off-screen by default and slides in
// as an overlay when the navbar's menu button is tapped — that toggle
// state lives here, since both Sidebar and Navbar need access to it.
const DashboardLayout = () => {
  const [isSidebarOpen, toggleSidebar] = useToggle(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;