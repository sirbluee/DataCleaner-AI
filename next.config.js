/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Disable React strict mode for better WebContainer compatibility
  reactStrictMode: false,
  // Configure SWC
  swcMinify: true,
  experimental: {
    forceSwcTransforms: false,
    serverComponentsExternalPackages: ['xlsx', 'papaparse']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;