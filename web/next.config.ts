import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bricklink.com' },
      { protocol: 'https', hostname: 'img.bricklink.com' },
      { protocol: 'https', hostname: 'ireland.apollo.olxcdn.com' },
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: 'jomhjzwalawouebbuegm.supabase.co' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;