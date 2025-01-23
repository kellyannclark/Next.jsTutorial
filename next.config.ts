import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable linting during the build process
  },
};

export default nextConfig;
