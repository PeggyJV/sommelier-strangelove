// Patch for @cosmjs/amino to fix ESM/CommonJS compatibility issues
// This file re-exports the necessary functions that graz expects

const amino = require("@cosmjs/amino/build/index.js")

// Create a new object with all the exports to avoid modifying read-only properties
const aminoExports = {
  // Spread all properties from the original amino module
  ...amino,

  // Explicitly export encoding functions
  encodeEd25519Pubkey: amino.encodeEd25519Pubkey,
  encodeSecp256k1Pubkey: amino.encodeSecp256k1Pubkey,
  encodeAminoPubkey: amino.encodeAminoPubkey,
  encodeBech32Pubkey: amino.encodeBech32Pubkey,
  decodeAminoPubkey: amino.decodeAminoPubkey,
  decodeBech32Pubkey: amino.decodeBech32Pubkey,

  // Address functions
  pubkeyToAddress: amino.pubkeyToAddress,
  pubkeyToRawAddress: amino.pubkeyToRawAddress,
  rawEd25519PubkeyToRawAddress: amino.rawEd25519PubkeyToRawAddress,
  rawSecp256k1PubkeyToRawAddress: amino.rawSecp256k1PubkeyToRawAddress,

  // Pubkey type functions
  isEd25519Pubkey: amino.isEd25519Pubkey,
  isSecp256k1Pubkey: amino.isSecp256k1Pubkey,
  isMultisigThresholdPubkey: amino.isMultisigThresholdPubkey,
  isSinglePubkey: amino.isSinglePubkey,
  pubkeyType: amino.pubkeyType,

  // Coin functions
  coin: amino.coin,
  coins: amino.coins,
  parseCoins: amino.parseCoins,
  addCoins: amino.addCoins,

  // Signature functions
  decodeSignature: amino.decodeSignature,
  encodeSecp256k1Signature: amino.encodeSecp256k1Signature,

  // Transaction functions
  makeSignDoc: amino.makeSignDoc,
  serializeSignDoc: amino.serializeSignDoc,
  makeStdTx: amino.makeStdTx,
  isStdTx: amino.isStdTx,

  // Path functions
  makeCosmoshubPath: amino.makeCosmoshubPath,

  // Wallet classes
  Secp256k1HdWallet: amino.Secp256k1HdWallet,
  Secp256k1Wallet: amino.Secp256k1Wallet,

  // KDF functions
  extractKdfConfiguration: amino.extractKdfConfiguration,
  executeKdf: amino.executeKdf,

  // Other utility functions
  createMultisigThresholdPubkey: amino.createMultisigThresholdPubkey,
  omitDefault: amino.omitDefault,

  // Export default for ESM default imports
  default: amino,
}

// Export the new object
module.exports = aminoExports
