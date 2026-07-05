// A generic, reusable Button — the kind of low-level "ui/" component
// that has no business logic and no idea what page it's used on.
// It just knows how to look and behave like a button, in a few variants.
//
// Usage:  <Button variant="accent" onClick={...}>Save</Button>
const variantStyles = {
  primary: "bg-brand-dark text-white hover:bg-brand-dark-hover",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  accent: "bg-brand-accent text-white hover:brightness-95",
};

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;