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
      new URL("https://cdn.losbroxas.org/**"),
      new URL("https://shared.steamstatic.com/**"),
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
