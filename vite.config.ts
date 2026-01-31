import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Use relative paths for file:// protocol support
  resolve: {
    alias: {
      "@/ui-ux": path.resolve(__dirname, "./UI, UX design"),
      "@/components": path.resolve(__dirname, "./UI, UX design/components"),
      "@/integrations": path.resolve(__dirname, "./back-end/integrations"),
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'frontend/main.tsx'), // Point directly to the TSX entry point
      },
      output: {
        format: 'iife', // No module loading for file:// protocol
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[extname]',
        inlineDynamicImports: true,
        name: 'AgroLens', // Global name for IIFE
      },
    },
  },
  plugins: [react()],
});
