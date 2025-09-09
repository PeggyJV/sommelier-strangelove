# EMFILE Error Fix Documentation

## Problem
Getting "EMFILE: too many open files" error when running Next.js application, particularly with large dependency trees like `viem`.

```
⨯ [Error: EMFILE: too many open files, open '/var/task/node_modules/viem/_esm/utils/ens/packetToBytes.js'] {
  errno: -24,
  code: 'EMFILE',
  syscall: 'open',
  path: '/var/task/node_modules/viem/_esm/utils/ens/packetToBytes.js',
  page: '/strategies/Alpha-stETH/manage'
}
```

## Root Cause
- Next.js bundler opening too many file descriptors simultaneously
- Large ESM packages like `viem` have many small module files
- System file descriptor limit being exceeded during build/runtime

## Solutions Applied

### 1. Next.js Configuration Optimizations (`next.config.js`)

```javascript
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

  // Add webpack ignore plugin for unnecessary files
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
```

### 2. Vercel Deployment Configuration (`vercel.json`)

```json
{
  "functions": {
    "pages/api/*.ts": {
      "maxDuration": 30
    },
    "pages/strategies/*/manage.tsx": {
      "maxDuration": 30,
      "memory": 3008
    },
    "pages/strategies/[id]/manage.tsx": {
      "maxDuration": 30,
      "memory": 3008
    }
  },
  "env": {
    "NODE_OPTIONS": "--max-old-space-size=8192",
    "SKIP_ENV_VALIDATION": "1"
  },
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=8192",
      "NEXT_TELEMETRY_DISABLED": "1",
      "SKIP_ENV_VALIDATION": "1"
    }
  },
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "npx pnpm@9 install --no-frozen-lockfile",
  "ignoreCommand": "git diff HEAD^ HEAD --quiet .",
  "github": {
    "silent": true
  },
  "crons": []
}
```

### 3. Package.json Script Updates

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=8192' next build",
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev",
    "start": "NODE_OPTIONS='--max-old-space-size=4096' next start"
  }
}
```

### 4. NPM Configuration (`.npmrc`)

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
node-linker=hoisted
public-hoist-pattern[]=*@nextjs/swc*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
enable-pre-post-scripts=true
lockfile=true
prefer-workspace-packages=true
resolution-mode=highest
```

## Local Development Solutions

### For macOS
If you still get EMFILE errors locally, increase the file descriptor limit:

```bash
# Check current limit
ulimit -n

# Increase limit for current session
ulimit -n 10000

# For permanent fix (requires restart):
sudo launchctl limit maxfiles 65536 200000
```

### For Linux
```bash
# Check current limit
ulimit -n

# Increase limit
ulimit -n 10000

# For permanent fix, edit /etc/security/limits.conf:
# * soft nofile 65536
# * hard nofile 65536
```

## Additional Optimizations

### Clear Caches
If issues persist, clear all caches:

```bash
rm -rf .next node_modules/.cache
pnpm install
pnpm build
```

### Use Turbopack (Experimental)
For development, you can try Next.js's new bundler:

```bash
pnpm dev --turbo
```

## Monitoring

Watch for these indicators that the fix is working:
- Build completes without EMFILE errors
- `webpackBuildWorker` experimental feature is enabled
- Filesystem cache is being used
- Memory usage stays within limits

## Troubleshooting

If errors persist:

1. **Check Node version**: Ensure using Node.js 22.x or later
2. **Check pnpm version**: Use pnpm 9.x or later
3. **Clear all caches**: `rm -rf .next node_modules pnpm-lock.yaml && pnpm install`
4. **Disable other tools**: Temporarily disable Sentry, analytics, etc.
5. **Reduce concurrent builds**: Set `NEXT_TELEMETRY_DISABLED=1`

## Files Modified

- `next.config.js` - Main webpack and Next.js optimizations
- `vercel.json` - Deployment configuration and memory limits
- `package.json` - Script memory optimizations
- `.npmrc` - Package manager configuration

## References

- [Next.js Webpack Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/webpack)
- [Vercel Function Configuration](https://vercel.com/docs/functions/configuring-functions)
- [Node.js Memory Management](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes)
- [pnpm Configuration](https://pnpm.io/npmrc)