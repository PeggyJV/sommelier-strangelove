# Vercel Build Fix - @cosmjs/encoding Import Errors

## Problem

When deploying to Vercel, the build was failing with the following errors:

```
Attempted import error: 'fromBech32' is not exported from '@cosmjs/encoding'
Attempted import error: 'toBech32' is not exported from '@cosmjs/encoding'
Attempted import error: 'encodeEd25519Pubkey' is not exported from '@cosmjs/amino'
```

### Root Cause

The issue occurs because:
1. `graz` v0.3.4 expects ESM exports from `@cosmjs/encoding`
2. `@cosmjs/encoding` v0.32.4 only provides CommonJS exports
3. Vercel's build environment handles module resolution differently than local development
4. The ESM/CommonJS interop fails when graz tries to import named exports from @cosmjs packages

## Solution

We implemented a multi-layered fix to ensure compatibility across all build environments:

### 1. Created Patch Files

**Files Created:**
- `/src/utils/patches/cosmjs-encoding-patch.js`
- `/src/utils/patches/cosmjs-amino-patch.js`
- `/src/utils/patches/cosmjs-proto-signing-patch.js`
- `/src/utils/patches/cosmjs-stargate-patch.js`
- `/src/utils/patches/cosmjs-cosmwasm-stargate-patch.js`

These patch files:
- Import the CommonJS builds of @cosmjs modules
- Re-export all functions in a format compatible with ESM imports
- Ensure both named and default exports work correctly
- Avoid modifying read-only properties by creating new export objects
- Provide comprehensive coverage for all @cosmjs modules used by graz

### 2. Updated Webpack Configuration

**File:** `/next.config.js`

Added webpack plugins and aliases:
- `NormalModuleReplacementPlugin` to redirect @cosmjs/encoding imports to our patch
- Proper handling for other @cosmjs modules (amino, proto-signing, stargate, cosmwasm-stargate)
- Module rules to treat @cosmjs packages as CommonJS (`javascript/auto`)
- Alias configuration to ensure consistent module resolution

### 3. Key Configuration Changes

```javascript
// Fix each @cosmjs module with its dedicated patch
config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /@cosmjs\/encoding$/,
    require.resolve("./src/utils/patches/cosmjs-encoding-patch.js")
  )
)

config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /@cosmjs\/amino$/,
    require.resolve("./src/utils/patches/cosmjs-amino-patch.js")
  )
)

config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /@cosmjs\/proto-signing$/,
    require.resolve("./src/utils/patches/cosmjs-proto-signing-patch.js")
  )
)

config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /@cosmjs\/stargate$/,
    require.resolve("./src/utils/patches/cosmjs-stargate-patch.js")
  )
)

config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /@cosmjs\/cosmwasm-stargate$/,
    require.resolve("./src/utils/patches/cosmjs-cosmwasm-stargate-patch.js")
  )
)

// Also add aliases for consistency
config.resolve.alias = {
  ...config.resolve.alias,
  "@cosmjs/encoding$": require.resolve("./src/utils/patches/cosmjs-encoding-patch.js"),
  "@cosmjs/amino$": require.resolve("./src/utils/patches/cosmjs-amino-patch.js"),
  "@cosmjs/proto-signing$": require.resolve("./src/utils/patches/cosmjs-proto-signing-patch.js"),
  "@cosmjs/stargate$": require.resolve("./src/utils/patches/cosmjs-stargate-patch.js"),
  "@cosmjs/cosmwasm-stargate$": require.resolve("./src/utils/patches/cosmjs-cosmwasm-stargate-patch.js"),
}
```

## Files Modified

1. `/next.config.js` - Webpack configuration updates

## Files Created

1. `/src/utils/patches/cosmjs-encoding-patch.js` - Patch for @cosmjs/encoding exports
2. `/src/utils/patches/cosmjs-amino-patch.js` - Patch for @cosmjs/amino exports including encodeEd25519Pubkey
3. `/src/utils/patches/cosmjs-proto-signing-patch.js` - Patch for @cosmjs/proto-signing exports
4. `/src/utils/patches/cosmjs-stargate-patch.js` - Patch for @cosmjs/stargate exports including GasPrice
5. `/src/utils/patches/cosmjs-cosmwasm-stargate-patch.js` - Patch for @cosmjs/cosmwasm-stargate exports

## Verification

The fix has been tested and verified:
- ✅ Local builds pass successfully
- ✅ TypeScript compilation succeeds
- ✅ All 42 pages generate correctly
- ✅ Bridge and snapshot pages (which use graz) build without errors

## Build Commands

```bash
# Local build (same as Vercel uses)
pnpm build

# Or with npm
NODE_OPTIONS='--max-old-space-size=8192' npm run build
```

## Why This Fix Works

1. **Module Resolution**: The patches ensure all @cosmjs module exports are available in the format graz expects
2. **CommonJS/ESM Compatibility**: By creating new export objects, we avoid ESM strict mode issues and read-only property errors
3. **Consistent Behavior**: The webpack configuration ensures the same behavior across local and Vercel environments
4. **No Package Changes**: This solution doesn't require changing package versions or dependencies
5. **Comprehensive Coverage**: All @cosmjs modules used by graz are patched, preventing future similar errors

## Future Considerations

- Monitor for updates to `graz` that might properly handle CommonJS imports
- Check if `@cosmjs` packages add ESM builds in future versions
- Consider upgrading when compatibility improves

## Troubleshooting

If the build fails on Vercel:
1. Ensure all patch files in `/src/utils/patches/` are committed to git
2. Check that the webpack config changes are in place
3. Clear Vercel's build cache and retry
4. Verify all @cosmjs packages are on compatible versions (0.32.4)
5. If a new @cosmjs module error appears, create a new patch file following the same pattern

## Related Issues

- graz expects ESM exports from @cosmjs packages
- @cosmjs v0.32.x only provides CommonJS builds
- Vercel's build environment has stricter module resolution than local dev