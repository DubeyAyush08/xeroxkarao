import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["pdfjs-dist"], // Exclude pdfjs-dist from optimization
  },
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.mjs": "pdfjs-dist/build/pdf.worker.js",
    },
  },
});