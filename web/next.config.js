/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.PINATA_GATEWAY.split(":")[0],
        hostname: process.env.PINATA_GATEWAY.split("://")[1],
      },
    ],
  },
};

module.exports = nextConfig;
