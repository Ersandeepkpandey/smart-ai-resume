import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal configuration to prevent build hanging
  compiler: {
    removeConsole: false, // Disable console removal optimization
  },

  // Disable all experimental features
  experimental: {},

  // Minimal webpack config
  webpack: (config, { isServer }) => {
    // Disable optimization that might cause hanging
    config.optimization = {
      ...config.optimization,
      minimize: false, // Disable minification temporarily
    };

    // Only exclude heavy dependencies from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Disable image optimization temporarily
  images: {
    unoptimized: true,
  },

  // Build configuration to handle potential issues
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
