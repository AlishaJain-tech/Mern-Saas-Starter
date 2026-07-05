import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 is configured as a Vite plugin directly — no separate
// tailwind.config.js or postcss.config.js is required for the basic setup.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});