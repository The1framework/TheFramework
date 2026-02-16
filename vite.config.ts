// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  /**
   * ✅ FIX
   * - In DEV: base must be "/" so links like /fr/ work on localhost
   * - In BUILD (GitHub Pages): base must be "/ACHI/" so assets & routes work under /ACHI/
   */
  base: command === "build" ? "/ACHI/" : "/",

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
