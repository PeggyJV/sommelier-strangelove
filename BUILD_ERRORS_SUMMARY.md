# Build Errors Summary

## Build Status: ❌ FAILED

The build is currently failing with multiple critical errors that need to be addressed.

## Critical Build Errors

### 1. Import Errors from 'graz' Module
The `graz` library appears to have breaking changes or version incompatibility issues.

**Affected Files:**
- `src/components/_cards/BridgeCard/InputAmount.tsx` - `mainnetChains` not exported
- `src/components/_cards/BridgeCard/InputSommelierAddress.tsx` - `mainnetChains` not exported
- `src/components/_cards/SnapshotCard/InputSommelierAddress.tsx` - `mainnetChains` not exported
- `src/hooks/web3/useBridgeSommToEthTx.tsx` - `useSigners` not exported
- `src/pages/bridge/index.tsx` - `mainnetChains` and `GrazChain` not exported
- `src/pages/snapshot/index.tsx` - `mainnetChains` and `GrazChain` not exported

### 2. Missing Module
```
Module not found: Can't resolve 'pino-pretty' in '/Users/zakimanian/somm/sommelier-strangelove/node_modules/pino/lib'
```

### 3. Runtime Error
```
TypeError: Cannot read properties of undefined (reading 'sommelier')
    at <unknown> (.next/server/pages/snapshot.js:1:15729)
```
This error occurs during page data collection for `/snapshot` route.

## TypeScript Errors (14 total)

### Type Incompatibility
1. **`src/components/_buttons/ConnectButton/ConnectWalletPopover.tsx:50`**
   - Type mismatch for `minH` prop with responsive values

### Missing Exports from 'graz'
2. **`src/components/_cards/BridgeCard/InputAmount.tsx:18`**
   - `mainnetChains` not exported from 'graz'
3. **`src/components/_cards/BridgeCard/InputSommelierAddress.tsx:13`**
   - `mainnetChains` not exported from 'graz'
4. **`src/components/_cards/SnapshotCard/InputSommelierAddress.tsx:15`**
   - `mainnetChains` not exported from 'graz'
5. **`src/hooks/web3/useBridgeSommToEthTx.tsx:4`**
   - `useSigners` not exported from 'graz'
6. **`src/pages/bridge/index.tsx:5`**
   - `GrazChain` not exported from 'graz'
7. **`src/pages/bridge/index.tsx:7`**
   - `mainnetChains` not exported from 'graz'
8. **`src/pages/snapshot/index.tsx:2`**
   - `GrazChain` and `mainnetChains` not exported from 'graz'

### Configuration Issues
9. **`src/pages/bridge/index.tsx:21`**
   - `defaultChain` is not a valid property in `ConfigureGrazArgs`
10. **`src/pages/snapshot/index.tsx:15`**
    - `defaultChain` is not a valid property in `ConfigureGrazArgs`

### Missing Props
11. **`src/pages/bridge/index.tsx:53`**
    - `GrazProvider` missing required prop `grazOptions`

### Other Type Errors
12. **`src/components/_cards/BridgeCard/InputAmount.tsx:71`**
    - Parameter 'item' implicitly has 'any' type
13. **`src/components/_cards/BridgeCard/InputAmount.tsx:211`**
    - Unused '@ts-expect-error' directive

## ESLint Warnings Summary (100+ warnings)

### Most Common Issues:
1. **Unused Variables** (~40 occurrences)
   - Multiple components have unused imports and variable declarations
2. **Use of `any` type** (~25 occurrences)
   - TypeScript best practices violation
3. **Missing React Display Names** (~5 occurrences)
   - Anonymous component definitions
4. **React Hooks Dependencies** (~5 occurrences)
   - Missing dependencies in useEffect hooks
5. **TypeScript Comment Directives** (~10 occurrences)
   - Using `@ts-ignore` instead of `@ts-expect-error`

## Root Causes Analysis

### 1. Graz Library Version Mismatch
The most critical issue appears to be a version incompatibility with the `graz` library. The code is trying to import members that either:
- No longer exist in the current version
- Have been renamed
- Have moved to different export paths

### 2. Missing Dependency
The `pino-pretty` module is required but not installed, likely a peer dependency issue.

### 3. Undefined Configuration
The snapshot page is trying to access a `sommelier` property that doesn't exist in the current configuration.

## Recommended Fix Priority

1. **🔴 CRITICAL - Fix graz imports** 
   - Check graz version in package.json
   - Update imports to match current graz API
   - Or downgrade graz to compatible version

2. **🔴 CRITICAL - Install missing dependencies**
   - Run `npm install pino-pretty` or add to package.json

3. **🔴 CRITICAL - Fix undefined 'sommelier' property**
   - Check configuration in snapshot page
   - Ensure proper initialization of chain configurations

4. **🟡 MEDIUM - Fix TypeScript errors**
   - Address type incompatibilities
   - Add proper typing for implicit any types

5. **🟢 LOW - Clean up ESLint warnings**
   - Remove unused variables
   - Replace any types with proper types
   - Fix React hooks dependencies

## Build Commands Reference

- **Build:** `npm run build` or `NODE_OPTIONS='--max-old-space-size=8192' next build`
- **Type Check:** `npm run typecheck`
- **Lint:** `npm run lint`
- **Lint Fix:** `npm run lint:fix`

## Notes

- The project uses pnpm but npm warnings suggest configuration issues
- TypeScript version (5.9.2) is not officially supported by @typescript-eslint
- Build skips validation and linting but still fails on runtime errors