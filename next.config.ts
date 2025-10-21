/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  serverExternalPackages: ['prisma', '@prisma/client'],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;