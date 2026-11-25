import type { NextConfig } from "next";

// Demo chạy hoàn toàn phía client (localStorage), không dùng Cache Components.
// Build cho GitHub Pages: đặt PAGES_BASE_PATH (VD "/mocy-platform") để xuất static ra out/.
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  ...(pagesBasePath !== undefined && {
    output: "export",
    trailingSlash: true,
    basePath: pagesBasePath,
    images: { unoptimized: true },
  }),
  env: { NEXT_PUBLIC_BASE_PATH: pagesBasePath ?? "" },
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
