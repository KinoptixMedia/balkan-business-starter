import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: host anywhere (Vercel, Netlify, cPanel shared hosting).
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
