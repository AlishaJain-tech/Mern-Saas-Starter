// A consistent "there's nothing here yet" pattern — a title, an
// optional friendlier description, and an optional action (usually a
// button prompting the person to create the first item). Used instead
// of every page writing its own one-off "No X yet" paragraph.
const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-slate-300 rounded-lg">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;