import { useState, useCallback } from "react";

// A tiny, generic hook for on/off state — used here for the sidebar's
// open/closed state, but reusable anywhere else you need a boolean
// toggle (modals, dropdowns, accordions, etc).
//
// Usage: const [isOpen, toggleOpen] = useToggle(false);
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return [value, toggle];
};

export default useToggle;