import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * base is "/" for local/dev; GitHub Pages project sites need "/<repo>/".
 * Override at build time: VITE_BASE=/MultiscaleModeling/ npm run build
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
