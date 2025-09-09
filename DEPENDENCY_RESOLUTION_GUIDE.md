# Dependency Resolution Guide for Sommelier Strangelove

## Overview

This guide documents all known dependency resolution issues and their fixes. These issues primarily affect the Vercel deployment but can also occur in local development.

## Common Issues and Solutions

### 1. @noble/hashes Module Resolution Errors

**Error:**
```
Module not found: Can't resolve '@noble/hashes/sha3'
Module not found: Can't resolve '@noble/hashes/utils'
Module not found: Can't resolve '@noble/curves/secp256k1'
```

**Root Causes:**
- Multiple versions of @noble packages in the dependency tree
- Nested node_modules with incompatible versions
- Packages trying to import subpath exports that don't exist in older versions

**Solution:**
- Force all packages to use @noble/hashes@1.8.0 and @noble/curves@1.9.1
- These versions support subpath exports properly
- See NOBLE_PACKAGES_FIX.md for detailed fix

### 2. @keplr-wallet Nested Dependencies

**Error:**
```
./node_modules/@keplr-wallet/cosmos/node_modules/@keplr-wallet/crypto/build/hash.js
Module not found: Can't resolve '@noble/hashes/sha3'
```

**Root Causes:**
- @keplr-wallet/cosmos creates nested node_modules
- Nested @keplr-wallet/crypto can't find noble packages
- Different versions of @keplr-wallet packages conflict

**Solution:**
- Install all @keplr-wallet packages explicitly at the same version
- Use postinstall script to create symlinks
- Force hoisting through pnpmfile.cjs

### 3. viem Version Conflicts

**Symptoms:**
- Different packages using different viem versions
- Type conflicts between viem versions
- Build errors related to viem imports

**Affected Packages:**
- @walletconnect/utils
- @wagmi/core
- @coinbase/wallet-sdk
- @gemini-wallet/core
- @base-org/account

**Solution:**
- Force all packages to use viem ^2.33.3
- Prevent nested viem installations

### 4. @cosmjs Package Issues

**Symptoms:**
- Module resolution errors in @cosmjs packages
- Version conflicts between different @cosmjs packages
- Axios version conflicts (especially with @cosmjs/launchpad)

**Solution:**
- Ensure all @cosmjs packages use version 0.32.4
- Force consistent noble package versions
- Force axios to use root version (^1.2.2) instead of old versions

### 5. Axios Version Conflicts

**Error:**
```
./node_modules/@cosmjs/tendermint-rpc/node_modules/axios/package.json
Module parse failed: Unexpected token (2:8)
You may need an appropriate loader to handle this file type
```

**Root Causes:**
- @cosmjs/launchpad uses old axios 0.21.4
- @cosmjs/tendermint-rpc might have nested axios
- Webpack tries to parse package.json as JavaScript

**Solution:**
- Force all packages to use axios ^1.2.2
- Remove nested axios installations
- Create symlinks to root axios package
- Add webpack alias for axios resolution

## Complete Fix Implementation

### Step 1: Create .pnpmfile.cjs

This file hooks into pnpm's package installation process:

```javascript
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Force noble packages to specific versions
      if (pkg.dependencies?.["@noble/hashes"]) {
        pkg.dependencies["@noble/hashes"] = "1.8.0"
      }
      if (pkg.dependencies?.["@noble/curves"]) {
        pkg.dependencies["@noble/curves"] = "1.9.1"
      }
      
      // Handle @keplr-wallet packages
      if (pkg.name?.startsWith("@keplr-wallet/")) {
        // Force noble versions
        if (pkg.dependencies?.["@noble/hashes"]) {
          pkg.dependencies["@noble/hashes"] = "1.8.0"
        }
        // Prevent nested @keplr installations
        Object.keys(pkg.dependencies || {}).forEach((dep) => {
          if (dep.startsWith("@keplr-wallet/")) {
            pkg.dependencies[dep] = "*"
          }
        })
      }
      
      // Force viem version consistency
      if (pkg.dependencies?.["viem"]) {
        pkg.dependencies["viem"] = "^2.33.3"
      }
      
      // Force axios version consistency
      if (pkg.dependencies?.["axios"]) {
        const axiosVersion = pkg.dependencies["axios"]
        if (axiosVersion.startsWith("0.") || axiosVersion === "^0.21.4") {
          pkg.dependencies["axios"] = "^1.2.2"
        }
      }
      
      return pkg
    }
  }
}
```

### Step 2: Create Postinstall Script

Create `scripts/fix-keplr-nested.js`:

```javascript
#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Remove nested node_modules
function removeNestedModules(dir) {
  // ... implementation
}

// Create symlinks for proper resolution
function createSymlinks() {
  // ... implementation
}

// Run fixes
removeNestedModules(path.join(process.cwd(), "node_modules"))
createSymlinks()
```

### Step 3: Update package.json

```json
{
  "scripts": {
    "postinstall": "node scripts/fix-keplr-nested.js"
  },
  "dependencies": {
    "@keplr-wallet/cosmos": "0.12.269",
    "@keplr-wallet/crypto": "0.12.269",
    "@keplr-wallet/common": "0.12.269",
    "@keplr-wallet/unit": "0.12.269",
    "@noble/hashes": "1.8.0",
    "@noble/curves": "1.9.1"
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

### Step 4: Configure Webpack (next.config.js)

```javascript
config.resolve.alias = {
  ...config.resolve.alias,
  "@noble/hashes": require.resolve("@noble/hashes"),
  "@noble/curves": require.resolve("@noble/curves"),
  "@noble/hashes/utils": require.resolve("@noble/hashes/utils"),
  "@noble/hashes/sha3": require.resolve("@noble/hashes/sha3"),
  "@noble/hashes/sha256": require.resolve("@noble/hashes/sha256"),
  "@noble/hashes/ripemd160": require.resolve("@noble/hashes/ripemd160"),
  "@noble/curves/secp256k1": require.resolve("@noble/curves/secp256k1"),
  // Force axios to use root version
  "axios": require.resolve("axios")
}
```

## Problematic Package List

These packages commonly cause issues:

### Crypto Libraries
- **@noble/hashes** - Must be version 1.8.0
- **@noble/curves** - Must be version 1.9.1
- **@scure/base** - Depends on noble packages
- **@scure/bip32** - Depends on noble packages
- **@scure/bip39** - Depends on noble packages

### Wallet Libraries
- **@keplr-wallet/** - All packages should use same version (0.12.269)
- **@walletconnect/** - Can bundle own viem version
- **@metamask/** - May have nested dependencies
- **@coinbase/wallet-sdk** - Uses viem
- **@gemini-wallet/core** - Uses viem
- **@base-org/account** - Uses viem

### Blockchain Libraries
- **@cosmjs/** - Should all use version 0.32.4
- **@confio/ics23** - Uses noble hashes
- **viem** - Should be ^2.33.3 everywhere
- **wagmi** - Can have nested viem

### Other Libraries
- **graz** - Contains @keplr-wallet dependencies
- **bitcoinjs-lib** - Uses noble hashes
- **bip39** - Uses noble hashes
- **axios** - HTTP client, multiple versions can conflict (use ^1.2.2)

## Verification Steps

After applying fixes:

1. **Check for nested modules:**
```bash
find node_modules -name node_modules -type d | grep -v "^node_modules$"
```

2. **Verify noble package versions:**
```bash
pnpm ls @noble/hashes @noble/curves
```

3. **Check @keplr-wallet symlinks:**
```bash
ls -la node_modules/@keplr-wallet/cosmos/node_modules/@keplr-wallet/
```

4. **Test build locally:**
```bash
pnpm build
```

## Vercel-Specific Considerations

1. **Clear Build Cache:** Project Settings → Functions → Clear Cache
2. **Environment Variables:** Ensure all required env vars are set
3. **Node Version:** Use Node 18+ for proper ESM support
4. **Build Command:** Should be `pnpm build`
5. **Install Command:** Vercel auto-detects pnpm from lockfile

## Troubleshooting

### If errors persist on Vercel:

1. **Check postinstall ran:**
   - Look for "Fixed nested dependencies" in build logs
   
2. **Verify files committed:**
   ```bash
   git status .pnpmfile.cjs scripts/fix-keplr-nested.js
   ```

3. **Force fresh install:**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "Update lockfile"
   ```

4. **Clear Vercel cache:**
   - Go to Vercel dashboard
   - Project Settings → Functions
   - Clear Cache & Redeploy

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Can't resolve '@noble/hashes/sha3'` | Wrong @noble/hashes version | Force version 1.8.0 |
| `anumber is not exported` | Old @noble/hashes version | Update to 1.8.0 |
| `Cannot find module '@keplr-wallet/crypto'` | Nested dependencies | Run postinstall script |
| `viem version mismatch` | Multiple viem versions | Force ^2.33.3 |
| `Module parse failed: Unexpected token` (package.json) | Webpack parsing package.json | Add webpack alias, remove nested modules |
| `axios version conflict` | Old axios in @cosmjs/launchpad | Force axios ^1.2.2 |

## Maintenance Guidelines

1. **Never upgrade @noble packages** without testing thoroughly
2. **Keep @keplr-wallet packages aligned** - use same version for all
3. **Test on Vercel preview** before production deploy
4. **Monitor pnpm-lock.yaml** for unexpected changes
5. **Document new issues** in this guide

## Related Documentation

- **NOBLE_PACKAGES_FIX.md** - Original noble packages issue
- **VERCEL_KEPLR_FIX.md** - Specific Vercel deployment fix
- **.pnpmfile.cjs** - Package resolution hooks
- **scripts/fix-keplr-nested.js** - Postinstall cleanup script

## Testing Checklist

Before deploying:

- [ ] Local build succeeds: `pnpm build`
- [ ] No nested node_modules (except allowed ones)
- [ ] Noble packages are correct versions
- [ ] Postinstall script runs without errors
- [ ] Vercel preview deployment works
- [ ] No TypeScript errors related to dependencies
- [ ] Module resolution errors are resolved

## Emergency Rollback

If a deployment breaks:

1. Revert to previous commit:
   ```bash
   git revert HEAD
   git push
   ```

2. Clear local environment:
   ```bash
   rm -rf node_modules pnpm-lock.yaml .next
   git checkout pnpm-lock.yaml
   pnpm install
   ```

3. Redeploy from Vercel dashboard using previous successful deployment

## Contact

For issues not covered in this guide:
- Check GitHub Issues for similar problems
- Review Vercel build logs carefully
- Test with minimal reproduction case