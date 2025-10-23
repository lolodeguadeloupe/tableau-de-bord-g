
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal','administration.clubcreole.fr'],
    hmr: {
      port: 8080,
      host: 'localhost',
      protocol: 'ws',
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
