import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "cdn.losbroxas.org", pathname: "/**" },
      { hostname: "shared.steamstatic.com", pathname: "/**" },
      { hostname: "steamcdn-a.akamaihd.net", pathname: "/**" },
      { hostname: "cdn.cloudflare.steamstatic.com", pathname: "/**" },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
