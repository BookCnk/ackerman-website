import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/wheels",
        destination: "/shop?category=Wheels",
        permanent: false,
      },
      {
        source: "/wheel",
        destination: "/shop?category=Wheels",
        permanent: false,
      },
      {
        source: "/tires",
        destination: "/shop?category=Tires",
        permanent: false,
      },
      {
        source: "/tire",
        destination: "/shop?category=Tires",
        permanent: false,
      },
      {
        source: "/brakes",
        destination: "/shop?category=Brakes+Calipers",
        permanent: false,
      },
      {
        source: "/brake",
        destination: "/shop?category=Brakes+Calipers",
        permanent: false,
      },
      {
        source: "/exhaust",
        destination: "/shop?category=Exhaust",
        permanent: false,
      },
      {
        source: "/suspension",
        destination: "/shop?category=Shock+Absorbers",
        permanent: false,
      },
      {
        source: "/parts",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/vehicles",
        destination: "/gallery",
        permanent: false,
      },
      {
        source: "/vehicle",
        destination: "/gallery",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
