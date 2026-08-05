import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Projects & tasks",
    description:
      "Organize work into projects, and break it into tasks, tracking status from todo to done.",
  },
  {
    title: "Team workspaces",
    description:
      "Every company gets its own private workspace — your team's data never mixes with anyone else's.",
  },
  {
    title: "AI-powered insights",
    description:
      "Generate task descriptions and project status summaries automatically, built right in.",
  },
];

// The hero's signature element: a static mock of the app's OWN task
// board — same column names, same priority pill colors as the real
// dashboard — rather than a generic illustration. It shows the product
// doing its actual job.
const BOARD_COLUMNS = [
  {
    label: "Todo",
    cards: [
      { title: "Design the homepage", tone: "high" },
      { title: "Write onboarding copy", tone: "medium" },
    ],
  },
  {
    label: "In Progress",
    cards: [{ title: "Set up analytics", tone: "medium" }],
  },
  {
    label: "Done",
    cards: [{ title: "Kickoff meeting", tone: "low" }],
  },
];

const TONE_STYLES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-lg font-semibold text-brand-dark">
          SaaS Starter
        </span>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-brand-dark transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 rounded-md bg-brand-dark text-white hover:bg-brand-dark-hover transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent mb-4">
            Built for teams, not just individuals
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight">
            Turn scattered work into a board everyone can see.
          </h1>
          <p className="mt-5 text-base text-slate-500 max-w-md">
            Projects, tasks, and teammates — organized in one private
            workspace per company, with AI that writes the busywork for you.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/register"
              className="px-5 py-3 rounded-md bg-brand-dark text-white text-sm font-medium hover:bg-brand-dark-hover transition-colors"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-brand-dark transition-colors"
            >
              I already have an account →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="grid grid-cols-3 gap-3">
            {BOARD_COLUMNS.map((column) => (
              <div key={column.label}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  {column.label}
                </p>
                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <div
                      key={card.title}
                      className="bg-slate-50 border border-slate-200 rounded-md p-2.5"
                    >
                      <p className="text-xs font-medium text-slate-800 leading-snug">
                        {card.title}
                      </p>
                      <span
                        className={`inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${TONE_STYLES[card.tone]}`}
                      >
                        {card.tone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-slate-400">
          Built as a portfolio project.
        </div>
      </footer>
    </div>
  );
};

export default Home;