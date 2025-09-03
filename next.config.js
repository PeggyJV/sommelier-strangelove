const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const { withSentryConfig } = require("@sentry/nextjs")

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
  // Experimental optimizations to reduce file operations
  experimental: {
    optimizePackageImports: [
      "viem",
      "@wagmi/core",
      "wagmi",
      "@tanstack/react-query",
      "@chakra-ui/react",
      "@rainbow-me/rainbowkit",
    ],
    webpackBuildWorker: true,
  },
  // Modularize imports for better tree-shaking
  modularizeImports: {
    "@chakra-ui/react": {
      transform: "@chakra-ui/{{member}}",
    },
  },
  // Transpile packages that might have ESM issues
  transpilePackages: [
    "@keplr-wallet/cosmos",
    "@keplr-wallet/types",
    "@cosmjs/launchpad",
    "@cosmjs/proto-signing",
    "@cosmjs/stargate",
    "graz",
  ],
  // Webpack configuration for better compatibility
  webpack: (config, { isServer, dev }) => {
    // Optimize webpack cache and module resolution
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    }

    // Optimize module resolution to reduce file operations
    config.resolve = {
      ...config.resolve,
      symlinks: false,
      extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
    }

    // Handle node polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        path: false,
        os: false,
      }
    }

    // Better handling of .mjs files
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })

    // Add webpack ignore plugin for unnecessary viem files
    const webpack = require("webpack")
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    )

    // Optimize viem imports
    if (!isServer) {
      config.module.rules.push({
        test: /node_modules\/viem/,
        sideEffects: false,
      })
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
