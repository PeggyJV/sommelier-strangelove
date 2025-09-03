// Patch for @cosmjs/stargate to fix ESM/CommonJS compatibility issues
// This file re-exports the necessary functions that graz expects

const stargate = require("@cosmjs/stargate/build/index.js")

// Create a new object with all the exports to avoid modifying read-only properties
const stargateExports = {
  // Spread all properties from the original stargate module
  ...stargate,

  // Client classes
  StargateClient: stargate.StargateClient,
  SigningStargateClient: stargate.SigningStargateClient,
  QueryClient: stargate.QueryClient,

  // Gas and fee utilities
  GasPrice: stargate.GasPrice,
  calculateFee: stargate.calculateFee,
  assertIsDeliverTxSuccess: stargate.assertIsDeliverTxSuccess,
  assertIsDeliverTxFailure: stargate.assertIsDeliverTxFailure,
  isDeliverTxSuccess: stargate.isDeliverTxSuccess,
  isDeliverTxFailure: stargate.isDeliverTxFailure,

  // Account and address utilities
  accountFromAny: stargate.accountFromAny,
  parseCoins: stargate.parseCoins,
  coin: stargate.coin,
  coins: stargate.coins,

  // Message and transaction utilities
  MsgSendEncodeObject: stargate.MsgSendEncodeObject,
  isMsgSendEncodeObject: stargate.isMsgSendEncodeObject,
  logs: stargate.logs,

  // Module extensions
  setupAuthExtension: stargate.setupAuthExtension,
  setupAuthzExtension: stargate.setupAuthzExtension,
  setupBankExtension: stargate.setupBankExtension,
  setupDistributionExtension: stargate.setupDistributionExtension,
  setupFeegrantExtension: stargate.setupFeegrantExtension,
  setupGovExtension: stargate.setupGovExtension,
  setupIbcExtension: stargate.setupIbcExtension,
  setupMintExtension: stargate.setupMintExtension,
  setupSlashingExtension: stargate.setupSlashingExtension,
  setupStakingExtension: stargate.setupStakingExtension,
  setupTxExtension: stargate.setupTxExtension,

  // IBC utilities
  createProtobufRpcClient: stargate.createProtobufRpcClient,
  createPagination: stargate.createPagination,
  longify: stargate.longify,

  // Transaction search
  TimeoutError: stargate.TimeoutError,
  IndexedTx: stargate.IndexedTx,
  SearchTxQuery: stargate.SearchTxQuery,
  SearchByHeightQuery: stargate.SearchByHeightQuery,
  SearchBySentFromOrToQuery: stargate.SearchBySentFromOrToQuery,
  SearchByTagsQuery: stargate.SearchByTagsQuery,

  // Default registry and amino types
  defaultRegistryTypes: stargate.defaultRegistryTypes,
  createDefaultAminoConverters: stargate.createDefaultAminoConverters,
  AminoTypes: stargate.AminoTypes,

  // Module interfaces
  AuthExtension: stargate.AuthExtension,
  BankExtension: stargate.BankExtension,
  StakingExtension: stargate.StakingExtension,
  TxExtension: stargate.TxExtension,
  GovExtension: stargate.GovExtension,
  IbcExtension: stargate.IbcExtension,
  SlashingExtension: stargate.SlashingExtension,
  DistributionExtension: stargate.DistributionExtension,
  MintExtension: stargate.MintExtension,
  FeegrantExtension: stargate.FeegrantExtension,
  AuthzExtension: stargate.AuthzExtension,

  // Other types and interfaces
  StdFee: stargate.StdFee,
  DeliverTxResponse: stargate.DeliverTxResponse,
  Account: stargate.Account,
  Block: stargate.Block,
  BlockHeader: stargate.BlockHeader,
  SequenceResponse: stargate.SequenceResponse,
  SearchTxFilter: stargate.SearchTxFilter,
  Coin: stargate.Coin,
  SignerData: stargate.SignerData,

  // Export default for ESM default imports
  default: stargate,
}

// Export the new object
module.exports = stargateExports
