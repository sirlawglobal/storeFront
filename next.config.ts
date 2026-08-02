import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://vitaformapi-tx0e.onrender.com/api/v1/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any domain for product images, or restrict to R2 bucket later
      }
    ],
  },
};

export default nextConfig;
