// Patch for @cosmjs/encoding to fix ESM/CommonJS compatibility issues
// This file re-exports the necessary functions that graz expects

const encoding = require("@cosmjs/encoding/build/index.js")

// Create a new object with all the exports to avoid modifying read-only properties
const encodingExports = {
  // Spread all properties from the original encoding module
  ...encoding,
  // Explicitly export the functions that graz needs
  fromBech32: encoding.fromBech32,
  toBech32: encoding.toBech32,
  normalizeBech32: encoding.normalizeBech32,
  fromBase64: encoding.fromBase64,
  toBase64: encoding.toBase64,
  fromHex: encoding.fromHex,
  toHex: encoding.toHex,
  fromUtf8: encoding.fromUtf8,
  toUtf8: encoding.toUtf8,
  fromAscii: encoding.fromAscii,
  toAscii: encoding.toAscii,
  fromRfc3339: encoding.fromRfc3339,
  toRfc3339: encoding.toRfc3339,
  // Export default for ESM default imports
  default: encoding,
}

// Export the new object
module.exports = encodingExports
