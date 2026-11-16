import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

// Only the weights the pages render. No family is ever italic.
import "@fontsource/sofia-sans/latin-400.css";
// This package only exports paths without ".css". See vite-env.d.ts.
import "@fontsource/big-shoulders-display/latin-700";
import "@fontsource/martian-mono/latin-400.css";

import "./styles/index.css";

/** Shared by every page's entry point: fonts, styles and the React root. */
export function mount(page: ReactNode) {
  createRoot(document.getElementById("root")!).render(<StrictMode>{page}</StrictMode>);
}
