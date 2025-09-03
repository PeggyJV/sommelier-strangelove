// Patch for @cosmjs/proto-signing to fix ESM/CommonJS compatibility issues
// This file re-exports the necessary functions that graz expects

const protoSigning = require("@cosmjs/proto-signing/build/index.js")

// Create a new object with all the exports to avoid modifying read-only properties
const protoSigningExports = {
  // Spread all properties from the original proto-signing module
  ...protoSigning,

  // Wallet classes
  DirectSecp256k1HdWallet: protoSigning.DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet: protoSigning.DirectSecp256k1Wallet,

  // Registry
  Registry: protoSigning.Registry,

  // Signing functions
  makeAuthInfoBytes: protoSigning.makeAuthInfoBytes,
  makeSignDoc: protoSigning.makeSignDoc,
  makeSignBytes: protoSigning.makeSignBytes,

  // Account functions
  accountFromAny: protoSigning.accountFromAny,

  // Coin functions
  coin: protoSigning.coin,
  coins: protoSigning.coins,

  // Pubkey functions
  encodePubkey: protoSigning.encodePubkey,
  decodePubkey: protoSigning.decodePubkey,
  isPbjsGeneratedType: protoSigning.isPbjsGeneratedType,

  // Signature functions
  encodeSignature: protoSigning.encodeSignature,
  decodeSignature: protoSigning.decodeSignature,

  // Type guards
  isOfflineDirectSigner: protoSigning.isOfflineDirectSigner,

  // Utilities
  createWithSigner: protoSigning.createWithSigner,
  makeCosmoshubPath: protoSigning.makeCosmoshubPath,

  // Re-export interfaces and types (these are type-only exports but we include them for completeness)
  OfflineDirectSigner: protoSigning.OfflineDirectSigner,
  OfflineSigner: protoSigning.OfflineSigner,
  AccountData: protoSigning.AccountData,
  DirectSignResponse: protoSigning.DirectSignResponse,
  SignerData: protoSigning.SignerData,

  // Export default for ESM default imports
  default: protoSigning,
}

// Export the new object
module.exports = protoSigningExports
