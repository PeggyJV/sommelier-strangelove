const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const { withSentryConfig } = require("@sentry/nextjs")

// Attribution KV build-time guardrails (allow fallback to KV_* envs)
;(function guardAttribEnv() {
  const reqUrl =
    process.env.ATTRIB_KV_KV_REST_API_URL || process.env.KV_REST_API_URL
  const reqTok =
    process.env.ATTRIB_KV_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN
  if (!reqUrl || !reqTok) {
    throw new Error(
      "[attrib-kv] Missing KV REST credentials. Provide ATTRIB_* or KV_* envs"
    )
  }
})()

const SentryOptions = {
  silent: true,
}

/**
 * mutable next.js configuration to ensure third party plugins such as bundle
 * analyzer and sentry works as intended
 *
 * @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Vercel build lint failure workaround; lints run separately in CI
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporary until upstream types stabilize; typecheck runs in CI
    ignoreBuildErrors: true,
  },

  // Minimal EMFILE optimizations
  experimental: {
    // Optimize imports for large packages to reduce file operations
    optimizePackageImports: [
      "viem",
      "@wagmi/core",
      "wagmi",
      "@tanstack/react-query",
      "@chakra-ui/react",
      "@rainbow-me/rainbowkit",
    ],
    // Use webpack build worker to reduce main thread file operations
    webpackBuildWorker: true,
  },

  // Simple webpack optimizations for file handling
  webpack: (config, { isServer, dev }) => {
    // Enable filesystem cache to reduce file operations
    if (!dev) {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      }
    }

    // Reduce file resolution overhead
    config.resolve = {
      ...config.resolve,
      symlinks: false,
    }

    // Fix viem module resolution issue by mocking Safe connector
    if (!isServer) {
      const path = require("path")

      // Redirect Safe imports to our mock to prevent viem CJS issues
      config.resolve.alias = {
        ...config.resolve.alias,
        // Mock the Safe packages that cause viem CJS import issues
        "@safe-global/safe-apps-sdk": path.resolve(
          __dirname,
          "src/lib/mocks/safe-mock.js"
        ),
        "@safe-global/safe-apps-provider": path.resolve(
          __dirname,
          "src/lib/mocks/safe-mock.js"
        ),
        // Also redirect any viem CJS imports to ESM as a fallback
        "viem/_cjs": "viem",
        "viem/dist/cjs": "viem",
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
        ],
      },
      {
        source: "/(.*)?", // Matches all pages
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ]
  },

  redirects: async () => {
    // because aave was using "cellars" not "strategies" we should redirect to handle previous user
    return [
      {
        source: "/cellars/0x7bad5df5e11151dc5ee1a648800057c5c934c0d5",
        destination: "/strategies/AAVE",
        permanent: true,
        basePath: false,
      },
      {
        source: "/strategies",
        destination: "/",
        permanent: true,
        basePath: false,
      },
    ]
  },
}

// https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer
nextConfig = withBundleAnalyzer(nextConfig)

// https://github.com/getsentry/sentry-webpack-plugin#options
// nextConfig = withSentryConfig(nextConfig, SentryOptions)

module.exports = nextConfig
