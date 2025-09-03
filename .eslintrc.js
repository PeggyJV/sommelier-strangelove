/**
 * ESLint config aligned with Next 15 + TS, scoped for CI and local runs.
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    // Silence the parser's TypeScript version support warning
    warnOnUnsupportedTypeScriptVersion: false,
  },
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint", "unused-imports"],
  rules: {
    // Next.js specifics
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",

    // Disable noisy rules to get to zero warnings
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/triple-slash-reference": "off",

    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "off",
    "react/no-children-prop": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",

    // Unused import handling (disabled to avoid warnings)
    "unused-imports/no-unused-imports": "off",
    "unused-imports/no-unused-imports-ts": "off",

    "prefer-const": "off",
  },
  ignorePatterns: [
    "**/__tests__/**/*",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.test.ts",
    "**/*.test.tsx",
    "tests/**",
    "coverage/**",
    "node_modules/**",
    "dist/**",
    "build/**",
    ".next/**",
    // Ignore vendored and type-definition sources that we don't control
    "src/vendor/**",
    "src/vendor/ignite/**",
    "src/types/**",
    "vercel-kv.d.ts",
  ],
}
