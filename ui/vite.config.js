import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dns from "node:dns";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        scope: "/",
        start_url: "/",
      },

      devOptions: {
        enabled: false,
      },

      workbox: {
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,json,woff,woff2}"],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|ico|webp|woff|woff2)$/,
            handler: "CacheFirst",
            options: { cacheName: "assets-cache" },
          },
          {
            urlPattern: /.*\.(js|css)$/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "static-cache" },
          },
        ],
      },

      includeAssets: ["favicon.ico", "offline.html"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/utilisateurs": {
        target: "http://localhost:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/cours": {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/multimedia": {
        target: "http://localhost:8083",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/classes": {
        target: "http://localhost:8084",
        changeOrigin: true,
        // rewrite: (path) => {
        //   return path.replace(/^\/api/, "");
        // },
      },
    },
  },
  preview: {
    allowedHosts: true,
  },
});
