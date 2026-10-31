import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Only the weights the page renders. No family is ever italic.
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";

import "./styles/index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
