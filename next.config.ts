import type { NextConfig } from "next";

// Demo chạy hoàn toàn phía client (localStorage), không dùng Cache Components.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
