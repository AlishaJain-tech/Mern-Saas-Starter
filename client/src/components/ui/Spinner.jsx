// A small, reusable spinning loader — used anywhere the app is waiting
// on data (page loads, form submissions, AI generation). Centralizing
// this means every "loading" moment in the app looks and feels
// consistent, instead of each page inventing its own.
const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-slate-300 border-t-brand-dark ${SIZE_CLASSES[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;