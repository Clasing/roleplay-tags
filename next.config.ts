import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'clasing-public.s3.eu-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio HTTPS
      },
    ],
  },
};

export default nextConfig;
