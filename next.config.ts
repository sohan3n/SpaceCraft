import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // First-party `/api/:path*` proxy.
  //
  // The Express/BetterAuth backend lives on a different *.vercel.app domain.
  // Because *.vercel.app is on the Public Suffix List, the browser treats the
  // two apps as separate sites and blocks cross-site cookies (session token,
  // OAuth state). Routing every API/auth call through this frontend origin
  // makes all cookies first-party, so Chrome stores and sends them normally.
  //
  // BACKEND_URL wins in production; NEXT_PUBLIC_API_URL stays as a fallback
  // for existing deployments; localhost keeps `npm run dev` working with no
  // .env file (proxying to the Express dev server on port 5000).
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000"
    ).replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
