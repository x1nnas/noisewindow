import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
};

let config = nextConfig;

try {
  // @ts-ignore
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development" && !process.env.ENABLE_PWA_DEV,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  });
  config = withPWA(nextConfig);
} catch (e) {
  // next-pwa not installed, continue without PWA
}

export default config;
