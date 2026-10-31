import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Only the weights the page renders. No family is ever italic.
import "@fontsource/sofia-sans/latin-400.css";
// This package only exports paths without ".css". See vite-env.d.ts.
import "@fontsource/big-shoulders-display/latin-700";
import "@fontsource/martian-mono/latin-400.css";

import "./styles/index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
