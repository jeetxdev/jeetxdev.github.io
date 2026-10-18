import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { yearsOfExperienceInWords } from "./src/data/career";

/** Meta tags are read before any JS runs, so the experience count is filled in at build time. */
function careerYears(): Plugin {
  return {
    name: "career-years",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll("__CAREER_YEARS__", yearsOfExperienceInWords()),
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), careerYears()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // No .map files and no sourceMappingURL comment, so devtools has nothing
    // to rebuild the src/ tree from - the Sources panel only ever shows the
    // bundled assets/index-*.js.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Flat, hashed asset names: no directory names survive into dist/.
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]",
      },
    },
  },
});
