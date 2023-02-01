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
  outputFileTracing: false, // Temporary fix for Sentry + Next 12 bug
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
