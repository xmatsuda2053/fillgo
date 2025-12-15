import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    target: "es2020",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    minify: true,
    rollupOptions: {
      input: "./fillgo.html",
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
