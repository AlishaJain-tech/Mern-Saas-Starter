// Placeholder page rendered inside DashboardLayout's <Outlet />.
// Confirms the sidebar + navbar + content area all render correctly
// together before any real dashboard data/logic exists.
const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
      <p className="mt-1 text-sm text-slate-500">
        This is a placeholder dashboard page inside the DashboardLayout.
      </p>
    </div>
  );
};

export default Dashboard;