import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Only the weights the page renders. Neither family is ever italic.
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/geist-mono/latin-500.css";
import "@fontsource/geist-mono/latin-600.css";
import "@fontsource/geist-mono/latin-700.css";

import "./styles/index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
