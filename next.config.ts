import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Izinkan placeholder
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Izinkan gambar dari Supabase (persiapan nanti)
      },
    ],
  },
};

export default nextConfig;