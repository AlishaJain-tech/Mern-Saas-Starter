import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(undefined);

// A minimal, dependency-free toast system. Any component can call
// showToast("Task created", "success") via useToast() — no need to
// pass callbacks down through props or manage visibility state itself.
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds — no need for the caller to clean
    // up after itself.
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Fixed-position stack in the bottom-right corner — rendered
          once, here, regardless of how many components call showToast. */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2.5 rounded-md shadow-lg text-sm font-medium text-white animate-[fadeIn_0.15s_ease-out] ${
              toast.type === "error" ? "bg-red-600" : "bg-brand-dark"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};