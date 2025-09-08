module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    [
      "@babel/preset-typescript",
      { allExtensions: true, isTSX: true },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
}
