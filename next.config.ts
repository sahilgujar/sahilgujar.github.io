import type { NextConfig } from "next";

// GitHub Pages only serves static files, so build the site as a static export into `out/`.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
