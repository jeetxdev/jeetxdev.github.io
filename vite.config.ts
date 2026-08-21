import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
