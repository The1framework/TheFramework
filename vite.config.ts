// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ command, mode }) => ({
  /**
   * DEV → "/"
   * BUILD → automatically detect repo name from environment
   */
  base:
    command === "build"
      ? process.env.GITHUB_REPOSITORY?.includes("TheFramework")
        ? "/TheFramework/"
        : "/ACHI/"
      : "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))