/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://linkkeeper-api.onrender.com/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL || 'https://linkkeeper-api.onrender.com/api'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
