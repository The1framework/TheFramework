// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ command, mode }) => ({
  /**
   * GitHub Pages Project Site Base
   * DEV  → "/"
   * BUILD → "/TheFramework/"
   *
   * This MUST be hardcoded for GitHub Pages project deployments.
   */
  base: command === "build" ? "/TheFramework/" : "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))