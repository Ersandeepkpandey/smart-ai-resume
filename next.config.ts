import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler optimizations (SWC is default in Next.js 15+)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental optimizations - disabled to prevent critters issues
  experimental: {
    // optimizeCss: true, // Disabled to prevent critters dependency issues
  },

  // External packages configuration
  serverExternalPackages: [],

  // Simplified webpack config to avoid build hanging
  webpack: (config, { isServer }) => {
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

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Reduce build output for faster builds
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Build configuration to handle potential issues
  typescript: {
    // Don't fail build on TypeScript errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  eslint: {
    // Don't fail build on ESLint errors
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
