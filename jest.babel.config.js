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

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { node: "current" }, modules: "commonjs" },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    [
      "@babel/preset-typescript",
      { isTSX: true, allExtensions: true, allowDeclareFields: true },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
}
