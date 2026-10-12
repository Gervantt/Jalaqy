import type { NextConfig } from "next";

// Корень проекта задан явно: выше по дереву лежит чужой package-lock.json.
const root = import.meta.dirname;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingRoot: root,
  turbopack: {
    root,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
