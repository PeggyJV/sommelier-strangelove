# Vercel Deployment Fix: @keplr-wallet and @noble/hashes Module Resolution

## Problem

When deploying to Vercel, the build fails with:

```
Module not found: Can't resolve '@noble/hashes/sha3'
Import trace:
./node_modules/@keplr-wallet/cosmos/node_modules/@keplr-wallet/crypto/build/hash.js
./node_modules/@keplr-wallet/cosmos/node_modules/@keplr-wallet/crypto/build/index.js
./node_modules/@keplr-wallet/cosmos/build/adr-36/amino.js
```

### Root Cause

1. **Nested Dependencies**: @keplr-wallet/cosmos creates nested node_modules containing its own copy of @keplr-wallet/crypto
2. **Version Mismatches**: The nested @keplr-wallet/crypto tries to import from @noble/hashes but can't resolve subpath exports
3. **Build Environment Differences**: Vercel's build process handles module resolution differently than local pnpm

## Complete Solution

The fix requires multiple components working together:

### 1. Enhanced .pnpmfile.cjs

This file hooks into pnpm's package resolution to force consistent versions:

```javascript
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix @noble packages versions across all dependencies
      if (pkg.dependencies) {
        if (pkg.dependencies["@noble/hashes"]) {
          pkg.dependencies["@noble/hashes"] = "1.8.0"
        }
        if (pkg.dependencies["@noble/curves"]) {
          pkg.dependencies["@noble/curves"] = "1.9.1"
        }
      }

      // Also fix in peerDependencies
      if (pkg.peerDependencies) {
        if (pkg.peerDependencies["@noble/hashes"]) {
          pkg.peerDependencies["@noble/hashes"] = "1.8.0"
        }
        if (pkg.peerDependencies["@noble/curves"]) {
          pkg.peerDependencies["@noble/curves"] = "1.9.1"
        }
      }

      // Fix all @keplr-wallet packages
      if (pkg.name && pkg.name.startsWith("@keplr-wallet/")) {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }

          // Prevent nested @keplr-wallet installations
          Object.keys(pkg.dependencies).forEach((dep) => {
            if (dep.startsWith("@keplr-wallet/")) {
              pkg.dependencies[dep] = "*"
            }
          })
        }
      }

      // Specifically fix @keplr-wallet/cosmos
      if (pkg.name === "@keplr-wallet/cosmos") {
        if (pkg.dependencies) {
          pkg.dependencies = {
            ...pkg.dependencies,
            "@keplr-wallet/crypto": "*",
            "@keplr-wallet/types": "*",
            "@keplr-wallet/common": "*",
            "@keplr-wallet/unit": "*",
            "@noble/hashes": "1.8.0",
            "@noble/curves": "1.9.1",
          }
        }
      }

      return pkg
    },
  },
}
```

### 2. Postinstall Script

Create `scripts/fix-keplr-nested.js` to handle nested modules that slip through:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const keplrPath = path.join(nodeModulesPath, '@keplr-wallet');

function removeNestedModules(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      const nestedNodeModules = path.join(fullPath, 'node_modules');
      
      if (fs.existsSync(nestedNodeModules)) {
        console.log(`Removing nested node_modules from ${fullPath.replace(process.cwd(), '.')}`);
        fs.rmSync(nestedNodeModules, { recursive: true, force: true });
      }
    }
  }
}

// Remove nested node_modules from all @keplr-wallet packages
if (fs.existsSync(keplrPath)) {
  console.log('Checking for nested @keplr-wallet dependencies...');
  removeNestedModules(keplrPath);
}

// Create symlinks for @keplr-wallet/crypto to ensure resolution
const keplrCryptoSource = path.join(nodeModulesPath, '@keplr-wallet', 'crypto');
const keplrCosmosModules = path.join(nodeModulesPath, '@keplr-wallet', 'cosmos', 'node_modules');

if (fs.existsSync(keplrCryptoSource)) {
  if (!fs.existsSync(keplrCosmosModules)) {
    fs.mkdirSync(keplrCosmosModules, { recursive: true });
  }
  
  const keplrWalletDir = path.join(keplrCosmosModules, '@keplr-wallet');
  if (!fs.existsSync(keplrWalletDir)) {
    fs.mkdirSync(keplrWalletDir, { recursive: true });
  }
  
  const keplrCryptoLink = path.join(keplrWalletDir, 'crypto');
  
  if (fs.existsSync(keplrCryptoLink)) {
    fs.rmSync(keplrCryptoLink, { recursive: true, force: true });
  }
  
  // Create symlink to the root @keplr-wallet/crypto
  console.log('Creating symlink for @keplr-wallet/crypto...');
  fs.symlinkSync(keplrCryptoSource, keplrCryptoLink, 'junction');
}

console.log('✅ Fixed nested @keplr-wallet dependencies');
```

### 3. Package.json Updates

Add explicit dependencies and postinstall script:

```json
{
  "scripts": {
    // ... other scripts ...
    "postinstall": "node scripts/fix-keplr-nested.js"
  },
  "dependencies": {
    // ... other dependencies ...
    "@keplr-wallet/cosmos": "0.12.269",
    "@keplr-wallet/crypto": "0.12.269",
    "@keplr-wallet/common": "0.12.269",
    "@keplr-wallet/unit": "0.12.269",
    "@keplr-wallet/types": "0.11.64",
    "@noble/curves": "1.9.1",
    "@noble/hashes": "1.8.0",
    // ... rest of dependencies ...
  },
  "pnpm": {
    "overrides": {
      "@noble/hashes": "1.8.0",
      "@noble/curves": "1.9.1",
      "@noble/hashes@*": "1.8.0",
      "@noble/curves@*": "1.9.1"
    }
  }
}
```

### 4. Next.config.js Webpack Aliases

Ensure webpack can resolve the subpath exports:

```javascript
// In next.config.js webpack configuration
config.resolve.alias = {
  ...config.resolve.alias,
  "@noble/hashes": require.resolve("@noble/hashes"),
  "@noble/curves": require.resolve("@noble/curves"),
  "@noble/hashes/utils": require.resolve("@noble/hashes/utils"),
  "@noble/hashes/sha3": require.resolve("@noble/hashes/sha3"),
  "@noble/hashes/sha256": require.resolve("@noble/hashes/sha256"),
  "@noble/hashes/ripemd160": require.resolve("@noble/hashes/ripemd160"),
  "@noble/curves/secp256k1": require.resolve("@noble/curves/secp256k1"),
}
```

## Installation Steps

1. **Clean Install**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

2. **Verify Fix**:
```bash
# Check for nested modules
ls node_modules/@keplr-wallet/cosmos/node_modules/@keplr-wallet/crypto
# Should show a symlink to the root crypto package

# Test build
pnpm build
```

3. **Commit All Files**:
```bash
git add .pnpmfile.cjs scripts/fix-keplr-nested.js package.json pnpm-lock.yaml
git commit -m "Fix @keplr-wallet and @noble module resolution for Vercel"
```

## Why This Works

1. **Explicit Dependencies**: By adding all @keplr-wallet packages explicitly, we ensure pnpm hoists them to the root
2. **Version Alignment**: All @keplr-wallet packages use the same version (0.12.269), preventing conflicts
3. **Symlink Strategy**: The postinstall script creates a symlink from the nested location to the root package
4. **pnpmfile Hooks**: Intercepts package installation to force consistent versions
5. **Webpack Aliases**: Ensures the bundler can resolve subpath exports correctly

## Vercel-Specific Considerations

- **Build Cache**: Clear Vercel's build cache if the issue persists (Project Settings → Functions → Clear Cache)
- **Node Version**: Ensure Vercel uses Node 18+ for proper ESM support
- **Package Manager**: Vercel automatically detects pnpm from the lockfile
- **Postinstall**: Vercel runs postinstall scripts automatically during build

## Troubleshooting

If the error persists on Vercel:

1. **Check Build Logs**: Look for the postinstall script output
2. **Verify Files**: Ensure `.pnpmfile.cjs` and `scripts/fix-keplr-nested.js` are committed
3. **Clear Cache**: In Vercel dashboard, clear build cache and redeploy
4. **Check Versions**: Run `pnpm ls @keplr-wallet/crypto @noble/hashes` locally
5. **Force Rebuild**: Push an empty commit to trigger a fresh build

## Related Issues

- Original @noble packages issue: See `NOBLE_PACKAGES_FIX.md`
- Similar to the `anumber` export error from @noble/hashes/utils
- Affects any package that uses @keplr-wallet with cryptographic functions

## Maintenance Notes

- **Don't upgrade @noble packages** without checking compatibility
- **Keep @keplr-wallet versions aligned** - use the same version for all @keplr-wallet packages
- **Test on Vercel preview** before merging to production
- The symlink approach works on both Unix and Windows systems (uses 'junction' type)