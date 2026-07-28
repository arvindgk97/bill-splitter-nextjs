import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.20.10.121",
    "172.20.10.121:3000",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
