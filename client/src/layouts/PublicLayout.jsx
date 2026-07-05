import { Outlet } from "react-router-dom";

// The layout used for all public-facing pages (landing page, and later
// login/signup/pricing). Kept intentionally minimal for now — no navbar
// or footer yet, since we're not building real pages this round.
//
// <Outlet /> is React Router's placeholder: whatever child route matched
// (see routes/AppRoutes.jsx) gets rendered right here.
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;