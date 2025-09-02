/**
 * ESLint config aligned with Next 15 + TS, scoped for CI and local runs.
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Temporary: avoid plugin crash while we align configs
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",
  },
}
