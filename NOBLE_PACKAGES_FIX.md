# @noble Packages Version Conflict Fix

## Problem

When deploying to Vercel, the build was failing with the following error:

```
./node_modules/@walletconnect/utils/node_modules/viem/node_modules/@noble/curves/esm/abstract/modular.js
Attempted import error: 'anumber' is not exported from '@noble/hashes/utils' (imported as 'anumber').
```

### Root Cause

The issue was caused by:
1. Multiple versions of `@noble/hashes` and `@noble/curves` packages in the dependency tree
2. WalletConnect had nested node_modules with incompatible versions
3. The nested `@noble/curves` was trying to import `anumber` from an older version of `@noble/hashes` that didn't have this export
4. Version mismatch between what viem expected (1.9.1 for curves, 1.8.0 for hashes) and what was being resolved

## Solution

### Complete Solution

The fix involves three key components:

### 1. Create .pnpmfile.cjs

This file forces all packages in the dependency tree to use compatible versions:

```javascript
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix @noble packages versions across all dependencies
      if (pkg.dependencies) {
        if (pkg.dependencies['@noble/hashes']) {
          pkg.dependencies['@noble/hashes'] = '1.8.0'
        }
        if (pkg.dependencies['@noble/curves']) {
          pkg.dependencies['@noble/curves'] = '1.9.1'
        }
      }

      // Fix viem's @noble dependencies specifically
      if (pkg.name === 'viem') {
        pkg.dependencies = {
          ...pkg.dependencies,
          '@noble/hashes': '1.8.0',
          '@noble/curves': '1.9.1'
        }
      }

      // Fix @walletconnect/utils to not bundle its own viem
      if (pkg.name === '@walletconnect/utils') {
        if (pkg.dependencies && pkg.dependencies['viem']) {
          pkg.dependencies['viem'] = '^2.33.3'
        }
      }

      // Ensure @walletconnect packages don't bundle conflicting versions
      if (pkg.name && pkg.name.startsWith('@walletconnect/')) {
        if (pkg.dependencies) {
          if (pkg.dependencies['@noble/hashes']) {
            pkg.dependencies['@noble/hashes'] = '1.8.0'
          }
          if (pkg.dependencies['@noble/curves']) {
            pkg.dependencies['@noble/curves'] = '1.9.1'
          }
        }
      }

      return pkg
    }
  }
}
```

### 2. Add pnpm Overrides to package.json

```json
"pnpm": {
  "overrides": {
    "@noble/hashes": "1.8.0",
    "@noble/curves": "1.9.1",
    "@noble/hashes@*": "1.8.0",
    "@noble/curves@*": "1.9.1"
  }
}
```

### 3. Install Dependencies

```bash
# Remove node_modules and lockfile to ensure clean install
rm -rf node_modules pnpm-lock.yaml

# Install with pnpm to apply the overrides
pnpm install
```

## Why This Works

1. **pnpmfile.cjs**: Intercepts package installation and forces consistent versions across the entire dependency tree
2. **No Nested node_modules**: The pnpmfile prevents @walletconnect/utils from creating nested node_modules with incompatible versions
3. **Version Alignment**: All packages use @noble/hashes@1.8.0 and @noble/curves@1.9.1 which are compatible
4. **Subpath Exports**: These versions properly support subpath exports like `@noble/hashes/sha3` and `@noble/curves/secp256k1`
5. **Override Precedence**: pnpm overrides ensure even transitive dependencies use the correct versions

## Verification

After applying the fix:
- ✅ No nested node_modules in @walletconnect/utils
- ✅ All @noble package imports resolve correctly
- ✅ No `anumber` export errors
- ✅ Build completes successfully
- ✅ Works on both local and Vercel deployments

Check that nested modules are gone:
```bash
ls node_modules/@walletconnect/utils/node_modules 2>/dev/null
# Should return "No such file or directory"
```

## Important Notes

- **pnpmfile.cjs is required**: This file must be present for pnpm to apply the version fixes
- **Don't upgrade @noble packages** without checking viem's requirements (currently 1.8.0 for hashes, 1.9.1 for curves)
- The `@noble/secp256k1` package no longer exists - it's been merged into `@noble/curves`
- **Always clean install**: After changing .pnpmfile.cjs or overrides, delete node_modules and pnpm-lock.yaml
- **Vercel deployment**: Make sure .pnpmfile.cjs is committed to git

## Related Dependencies

These packages depend on @noble libraries:
- `viem` - Requires specific versions (1.9.1 for curves, 1.8.0 for hashes)
- `@walletconnect/utils` - Uses viem internally
- `@wagmi/core` - Uses viem for crypto operations
- Various wallet connectors that use cryptographic functions

## Troubleshooting

If this error reoccurs:
1. Verify .pnpmfile.cjs exists and is committed to git
2. Check for nested node_modules: `ls node_modules/@walletconnect/*/node_modules`
3. Check installed versions: `pnpm ls @noble/hashes @noble/curves`
4. Clear everything and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
5. Ensure pnpm-lock.yaml is committed after successful install
6. For Vercel: Clear build cache in project settings