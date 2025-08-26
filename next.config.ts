import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Exclude heavy server-side packages from client bundle
  serverExternalPackages: [
    'puppeteer',
    'pdf-parse', 
    'mammoth',
    '@react-pdf/renderer',
    'nodemailer',
    'bcryptjs',
    'formidable'
  ],

  // Build optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Reduce bundle size by excluding unused dependencies
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-pdf/renderer': false,
        'puppeteer': false,
        'pdf-parse': false,
        'mammoth': false,
      };
    }
    return config;
  },

  // Reduce build output
  output: 'standalone',
  
  // Skip generating source maps in production
  productionBrowserSourceMaps: false,
  
};

export default nextConfig;
