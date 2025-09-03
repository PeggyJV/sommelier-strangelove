// Patch for @cosmjs/cosmwasm-stargate to fix ESM/CommonJS compatibility issues
// This file re-exports the necessary functions that graz expects

const cosmwasm = require("@cosmjs/cosmwasm-stargate/build/index.js")

// Create a new object with all the exports to avoid modifying read-only properties
const cosmwasmExports = {
  // Spread all properties from the original cosmwasm-stargate module
  ...cosmwasm,

  // Client classes
  CosmWasmClient: cosmwasm.CosmWasmClient,
  SigningCosmWasmClient: cosmwasm.SigningCosmWasmClient,

  // Result types
  ExecuteResult: cosmwasm.ExecuteResult,
  InstantiateResult: cosmwasm.InstantiateResult,
  MigrateResult: cosmwasm.MigrateResult,
  UploadResult: cosmwasm.UploadResult,

  // Contract functions
  instantiate: cosmwasm.instantiate,
  execute: cosmwasm.execute,
  migrate: cosmwasm.migrate,
  upload: cosmwasm.upload,

  // Query functions
  queryContractSmart: cosmwasm.queryContractSmart,
  queryContractRaw: cosmwasm.queryContractRaw,

  // Code functions
  getCodeDetails: cosmwasm.getCodeDetails,
  getCodes: cosmwasm.getCodes,
  getContract: cosmwasm.getContract,
  getContracts: cosmwasm.getContracts,
  getContractsByCreator: cosmwasm.getContractsByCreator,

  // History functions
  getContractHistory: cosmwasm.getContractHistory,

  // Options and configuration
  SigningCosmWasmClientOptions: cosmwasm.SigningCosmWasmClientOptions,
  ExecuteInstruction: cosmwasm.ExecuteInstruction,
  InstantiateOptions: cosmwasm.InstantiateOptions,
  MigrateOptions: cosmwasm.MigrateOptions,
  UploadOptions: cosmwasm.UploadOptions,

  // Message types
  MsgExecuteContractEncodeObject: cosmwasm.MsgExecuteContractEncodeObject,
  MsgInstantiateContractEncodeObject: cosmwasm.MsgInstantiateContractEncodeObject,
  MsgInstantiateContract2EncodeObject: cosmwasm.MsgInstantiateContract2EncodeObject,
  MsgMigrateContractEncodeObject: cosmwasm.MsgMigrateContractEncodeObject,
  MsgStoreCodeEncodeObject: cosmwasm.MsgStoreCodeEncodeObject,
  MsgClearAdminEncodeObject: cosmwasm.MsgClearAdminEncodeObject,
  MsgUpdateAdminEncodeObject: cosmwasm.MsgUpdateAdminEncodeObject,

  // Type guards
  isMsgExecuteContractEncodeObject: cosmwasm.isMsgExecuteContractEncodeObject,
  isMsgInstantiateContractEncodeObject: cosmwasm.isMsgInstantiateContractEncodeObject,
  isMsgInstantiateContract2EncodeObject: cosmwasm.isMsgInstantiateContract2EncodeObject,
  isMsgMigrateContractEncodeObject: cosmwasm.isMsgMigrateContractEncodeObject,
  isMsgStoreCodeEncodeObject: cosmwasm.isMsgStoreCodeEncodeObject,
  isMsgClearAdminEncodeObject: cosmwasm.isMsgClearAdminEncodeObject,
  isMsgUpdateAdminEncodeObject: cosmwasm.isMsgUpdateAdminEncodeObject,

  // Amino types
  cosmWasmTypes: cosmwasm.cosmWasmTypes,
  createWasmAminoConverters: cosmwasm.createWasmAminoConverters,

  // IBC types
  wasmTypes: cosmwasm.wasmTypes,

  // Setup functions
  setupWasmExtension: cosmwasm.setupWasmExtension,
  WasmExtension: cosmwasm.WasmExtension,

  // JsonObject type
  JsonObject: cosmwasm.JsonObject,

  // Contract info types
  ContractInfo: cosmwasm.ContractInfo,
  ContractCodeHistoryEntry: cosmwasm.ContractCodeHistoryEntry,
  CodeDetails: cosmwasm.CodeDetails,
  Code: cosmwasm.Code,

  // Other utilities
  toUtf8: cosmwasm.toUtf8,
  fromUtf8: cosmwasm.fromUtf8,
  toBase64: cosmwasm.toBase64,
  fromBase64: cosmwasm.fromBase64,

  // Export default for ESM default imports
  default: cosmwasm,
}

// Export the new object
module.exports = cosmwasmExports
