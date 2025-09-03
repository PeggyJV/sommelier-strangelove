const path = require("path")
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
    "@cosmjs/encoding",
    "@cosmjs/amino",
    "@cosmjs/cosmwasm-stargate",
    "graz",
    "@tanstack/react-query",
    "@tanstack/react-query-devtools",
  ],
  // Webpack configuration for better compatibility
  webpack: (config, { isServer, dev, webpack }) => {
    // Optimize webpack cache and module resolution
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    }

    // Handle pino-pretty which is only needed for dev and has Node.js dependencies
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^pino-pretty$/,
        })
      )
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "")
          }
        )
      )

      // Fix @cosmjs ESM/CommonJS compatibility issue for Vercel builds
      // Use our patch file for @cosmjs/encoding to ensure exports work correctly
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@cosmjs\/encoding$/,
          require.resolve(
            "./src/utils/patches/cosmjs-encoding-patch.js"
          )
        )
      )

      // Use our patch file for @cosmjs/amino to ensure exports work correctly
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@cosmjs\/amino$/,
          require.resolve("./src/utils/patches/cosmjs-amino-patch.js")
        )
      )

      // Use our patch file for @cosmjs/proto-signing to ensure exports work correctly
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@cosmjs\/proto-signing$/,
          require.resolve(
            "./src/utils/patches/cosmjs-proto-signing-patch.js"
          )
        )
      )

      // Use our patch file for @cosmjs/stargate to ensure exports work correctly
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@cosmjs\/stargate$/,
          require.resolve(
            "./src/utils/patches/cosmjs-stargate-patch.js"
          )
        )
      )

      // Use our patch file for @cosmjs/cosmwasm-stargate to ensure exports work correctly
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@cosmjs\/cosmwasm-stargate$/,
          require.resolve(
            "./src/utils/patches/cosmjs-cosmwasm-stargate-patch.js"
          )
        )
      )

      // Force @noble packages to use root versions, not nested ones
      // This handles the issue with @walletconnect/utils having nested incompatible versions
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@noble\/(hashes|curves)/,
          (resource) => {
            // Extract the package name and subpath if any
            const match = resource.request.match(
              /@noble\/(hashes|curves)(\/.*)?$/
            )
            if (match) {
              const pkg = match[1]
              const subpath = match[2] || ""
              // Force resolution to root node_modules version
              try {
                resource.request = require.resolve(
                  `@noble/${pkg}${subpath}`
                )
              } catch {
                // If subpath doesn't resolve directly, use the main package
                resource.request = require.resolve(`@noble/${pkg}`)
              }
            }
          }
        )
      )
    }

    // Optimize module resolution to reduce file operations
    config.resolve = {
      ...config.resolve,
      symlinks: false,
      extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
      // Prefer ES modules over CommonJS
      mainFields: ["module", "main"],
      alias: {
        ...config.resolve.alias,
        // Force @noble packages to use root versions
        "@noble/hashes": require.resolve("@noble/hashes"),
        "@noble/curves": require.resolve("@noble/curves"),
        "@noble/hashes/utils": require.resolve("@noble/hashes/utils"),
        "@noble/hashes/sha3": require.resolve("@noble/hashes/sha3"),
        "@noble/hashes/sha256": require.resolve(
          "@noble/hashes/sha256"
        ),
        "@noble/hashes/ripemd160": require.resolve(
          "@noble/hashes/ripemd160"
        ),
        "@noble/curves/secp256k1": require.resolve(
          "@noble/curves/secp256k1"
        ),
        // Force ES module resolution for problematic packages
        "@walletconnect/utils$":
          "@walletconnect/utils/dist/index.es.js",
        "@walletconnect/core$":
          "@walletconnect/core/dist/index.es.js",
        "@walletconnect/sign-client$":
          "@walletconnect/sign-client/dist/index.es.js",
        // Ensure @cosmjs modules always use our patches
        "@cosmjs/encoding$": require.resolve(
          "./src/utils/patches/cosmjs-encoding-patch.js"
        ),
        "@cosmjs/amino$": require.resolve(
          "./src/utils/patches/cosmjs-amino-patch.js"
        ),
        "@cosmjs/proto-signing$": require.resolve(
          "./src/utils/patches/cosmjs-proto-signing-patch.js"
        ),
        "@cosmjs/stargate$": require.resolve(
          "./src/utils/patches/cosmjs-stargate-patch.js"
        ),
        "@cosmjs/cosmwasm-stargate$": require.resolve(
          "./src/utils/patches/cosmjs-cosmwasm-stargate-patch.js"
        ),
      },
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
        worker_threads: false,
        module: false,
        perf_hooks: false,
        child_process: false,
        process: false,
        events: false,
        // Additional fallbacks for pino
        "node:stream": false,
        "node:worker_threads": false,
      }

      // Exclude pino and related modules from client bundle
      config.externals = {
        ...config.externals,
        "pino-pretty": "commonjs pino-pretty",
        pino: "commonjs pino",
      }
    }

    // Better handling of .mjs files
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })

    // Ensure @cosmjs modules are handled as CommonJS
    config.module.rules.push({
      test: /node_modules\/@cosmjs/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    })

    // Force WalletConnect packages to be treated as ES modules
    config.module.rules.push({
      test: /node_modules\/@walletconnect/,
      resolve: {
        fullySpecified: false,
        preferRelative: false,
      },
    })

    // Add webpack ignore plugin for unnecessary viem files
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
