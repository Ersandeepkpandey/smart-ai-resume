import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal webpack config to prevent hanging (restore working version)
  webpack: (config) => {
    config.optimization.minimize = false;
    config.optimization.splitChunks = false;
    config.optimization.sideEffects = false;
    return config;
  },

  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
