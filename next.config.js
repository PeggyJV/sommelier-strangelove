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
    return [
      {
        source:
          "/strategies/0x6e2dac3b9e9adc0cbbae2d0b9fd81952a8d33872",
        destination: `/strategies/ETH-BTC-Momentum`,
        permanent: true,
        basePath: false,
      },
      {
        source: `/strategies/0x6b7f87279982d919bbf85182ddeab179b366d8f2`,
        destination: `/strategies/ETH-BTC-Trend`,
        permanent: true,
        basePath: false,
      },
      {
        source:
          "/strategies/0x7bad5df5e11151dc5ee1a648800057c5c934c0d5",
        destination: "/strategies/AAVE",
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
