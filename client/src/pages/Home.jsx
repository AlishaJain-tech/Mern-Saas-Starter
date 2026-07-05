// Placeholder page so the "/" route has something to render and the
// PublicLayout can be visually verified. Real landing page content
// (and later, login/signup) will replace this.
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Welcome</h1>
      <p className="mt-2 text-slate-500 max-w-md">
        This is a placeholder public page. Real content will go here once
        auth and business logic are added.
      </p>
    </div>
  );
};

export default Home;