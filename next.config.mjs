/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: 'http://localhost:3001/api/socket/:path*',
      },
    ];
  },
};

export default nextConfig;
