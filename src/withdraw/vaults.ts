// Every Somm vault that still has shares outstanding on Ethereum, Arbitrum or Optimism.
// Addresses come from src/utils/config.ts and src/data/strategies/* on main; each was
// checked on-chain for non-zero totalSupply on 2026-11-19.
// Share decimals, the underlying asset and its decimals are read on-chain at runtime.

import type { Address } from "viem"

export const CHAINS = {
  1: { name: "Ethereum", explorer: "https://etherscan.io" },
  42161: { name: "Arbitrum", explorer: "https://arbiscan.io" },
  10: { name: "Optimism", explorer: "https://optimistic.etherscan.io" },
} as const

export type ChainId = keyof typeof CHAINS

export type Vault = {
  key: string
  name: string
  chainId: ChainId
  address: Address
  // Cellars are ERC4626-style and redeem directly. "boring" is the Alpha stETH BoringVault,
  // which only exits through its on-chain withdraw queue.
  kind: "cellar" | "boring"
  // Legacy SOMM rewards staking contract that holds this vault's shares, if any.
  staker?: Address
}

// Old (v0.8.21) cellar withdraw queue, per chain. Shares stay in the user's wallet, so an open
// request never blocks a direct redeem; we only surface it so it can be cancelled.
export const WITHDRAW_QUEUE: Record<ChainId, Address> = {
  1: "0x5751d75b642975E4E7fdE39f35F9a6c11b867169",
  42161: "0x516AD60801b62fCABCCDA7be178e4478D4018071",
  10: "0x516AD60801b62fCABCCDA7be178e4478D4018071",
}

export const ALPHA_STETH_QUEUE: Address = "0xe39682c3C44b73285A2556D4869041e674d1a6B7"

// Assets the Alpha stETH queue can pay out in; which are enabled is read on-chain.
export const ALPHA_STETH_ASSETS_OUT: { symbol: string; address: Address }[] = [
  { symbol: "stETH", address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" },
  { symbol: "wstETH", address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" },
  { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
]

export const VAULTS: Vault[] = [
  // Ethereum
  { key: "turbo-somm", name: "Turbo SOMM", chainId: 1, kind: "cellar", address: "0x5195222f69c5821f8095ec565E71e18aB6A2298f" },
  { key: "turbo-ezeth", name: "Turbo ezETH", chainId: 1, kind: "cellar", address: "0x27500De405a3212D57177A789E30bb88b0AdbeC5", staker: "0x4705F50b9c6CdffC6528ba6B3754106eE820997E" },
  { key: "turbo-gho", name: "Turbo GHO", chainId: 1, kind: "cellar", address: "0x0C190DEd9Be5f512Bd72827bdaD4003e9Cc7975C", staker: "0x6e5bb558D6C33Ca45dc9eFE0746a3C80BC3E70e1" },
  { key: "turbo-eethv2", name: "Turbo eETH V2", chainId: 1, kind: "cellar", address: "0xdAdC82e26b3739750E036dFd9dEfd3eD459b877A", staker: "0x4A0c0BA71647Be8AF0D98F565EcdB6B8ddE07B47" },
  { key: "turbo-eeth", name: "Turbo eETH", chainId: 1, kind: "cellar", address: "0x9a7b4980C6F0FCaa50CD5f288Ad7038f434c692e", staker: "0x596C3f05bA9c6c356527E47989b3Ed26E2B3449d" },
  { key: "turbo-ethx", name: "Turbo ETHx", chainId: 1, kind: "cellar", address: "0x19B8D8FC682fC56FbB42653F68c7d48Dd3fe597E", staker: "0x88EDf544b5d4Ba6A11D40375e4bAEf3f1Ec5aF11" },
  { key: "turbo-rseth", name: "Turbo rsETH", chainId: 1, kind: "cellar", address: "0x1dffb366b5c5A37A12af2C127F31e8e0ED86BDbe", staker: "0xC6b423E3D25e6B36ab60Fa2c91FF344877F8Ead2" },
  { key: "turbo-sweth", name: "Turbo swETH", chainId: 1, kind: "cellar", address: "0xd33dad974b938744dac81fe00ac67cb5aa13958e", staker: "0x69374d81fDc42adD0Fe1Dc655705e40b51B6681b" },
  { key: "turbo-steth", name: "Turbo stETH (WETH deposit)", chainId: 1, kind: "cellar", address: "0xfd6db5011b171b05e1ea3b92f9eacaeeb055e971" },
  { key: "turbo-steth-steth", name: "Turbo stETH (stETH deposit)", chainId: 1, kind: "cellar", address: "0xc7372Ab5dd315606dB799246E8aA112405abAeFf" },
  { key: "turbo-diveth", name: "Turbo divETH", chainId: 1, kind: "cellar", address: "0x6c1edce139291Af5b84fB1e496c9747F83E876c9" },
  { key: "morpho-eth", name: "Morpho ETH Maximizer", chainId: 1, kind: "cellar", address: "0xcf4B531b4Cde95BD35d71926e09B2b54c564F5b6", staker: "0xe468c1156d4b3399e4Aa1080c58fFBc6119722F9" },
  { key: "alpha-steth", name: "Alpha stETH", chainId: 1, kind: "boring", address: "0xef417FCE1883c6653E7dC6AF7c6F85CCDE84Aa09" },
  { key: "real-yield-usd", name: "Real Yield USD", chainId: 1, kind: "cellar", address: "0x97e6e0a40a3d02f12d1cec30ebfbae04e37c119e", staker: "0x8510f22bd1932afb4753b6b3edf5db00c7e7a748" },
  { key: "real-yield-eth", name: "Real Yield ETH", chainId: 1, kind: "cellar", address: "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec", staker: "0x955a31153e6764FE892757AcE79123ae996B0aFB" },
  { key: "real-yield-btc", name: "Real Yield BTC", chainId: 1, kind: "cellar", address: "0x0274a704a6d9129f90a62ddc6f6024b33ecdad36", staker: "0x1eFF374fd9AA7266504144da861Fff9BBd31828e" },
  { key: "real-yield-link", name: "Real Yield LINK", chainId: 1, kind: "cellar", address: "0x4068bdd217a45f8f668ef19f1e3a1f043e4c4934" },
  { key: "real-yield-ens", name: "Real Yield ENS", chainId: 1, kind: "cellar", address: "0x18ea937aba6053bc232d9ae2c42abe7a8a2be440" },
  { key: "real-yield-1inch", name: "Real Yield 1INCH", chainId: 1, kind: "cellar", address: "0xc7b69e15d86c5c1581dacce3cacaf5b68cd6596f" },
  { key: "real-yield-snx", name: "Real Yield SNX", chainId: 1, kind: "cellar", address: "0xcbf2250f33c4161e18d4a2fa47464520af5216b5" },
  { key: "real-yield-uni", name: "Real Yield UNI", chainId: 1, kind: "cellar", address: "0x6a6af5393dc23d7e3db28d28ef422db7c40932b6" },
  { key: "eth-trend-growth", name: "ETH Trend Growth", chainId: 1, kind: "cellar", address: "0x6c51041a91c91c86f3f08a72cb4d3f67f1208897", staker: "0xb1D3948F4DCd7Aa5e89449080F3D88870aD0137A" },
  { key: "fraximal", name: "Fraximal", chainId: 1, kind: "cellar", address: "0xdbe19d1c3f21b1bb250ca7bdae0687a97b5f77e6", staker: "0x290a42e913083edf5aefb241f8a12b306c19f8f9" },
  { key: "defi-stars", name: "DeFi Stars", chainId: 1, kind: "cellar", address: "0x03df2a53cbed19b824347d6a45d09016c2d1676a", staker: "0x0349b3c56adb9e39b5d75fc1df52eee313dd80d1" },
  { key: "steady-eth", name: "Steady ETH", chainId: 1, kind: "cellar", address: "0x3f07a84ecdf494310d397d24c1c78b041d2fa622", staker: "0xae0e6024972b70601bc35405479af5cd372cc956" },
  { key: "steady-btc", name: "Steady BTC", chainId: 1, kind: "cellar", address: "0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d", staker: "0xd1d02c16874e0714fd825213e0c13eab6dd9c25f" },
  { key: "steady-uni", name: "Steady UNI", chainId: 1, kind: "cellar", address: "0x6f069f711281618467dae7873541ecc082761b33", staker: "0x74a9a6fab61e128246a6a5242a3e96e56198cbdd" },
  { key: "steady-matic", name: "Steady MATIC", chainId: 1, kind: "cellar", address: "0x05641a27c82799aaf22b436f20a3110410f29652", staker: "0x7da7e27e4bcc6ec8bc06349e1cef6634f6df7c5c" },
  { key: "eth-btc-trend", name: "ETH-BTC Trend", chainId: 1, kind: "cellar", address: "0x6b7f87279982d919bbf85182ddeab179b366d8f2", staker: "0x9eEaBfFf5D15e8CedFD2F6C914c8826ba0a5FbBD" },
  { key: "eth-btc-momentum", name: "ETH-BTC Momentum", chainId: 1, kind: "cellar", address: "0x6e2dac3b9e9adc0cbbae2d0b9fd81952a8d33872", staker: "0x6Ce314c39F30488B4a86B8892C81a5B7af83e337" },
  { key: "aave2", name: "Aave Stablecoin", chainId: 1, kind: "cellar", address: "0x7bad5df5e11151dc5ee1a648800057c5c934c0d5", staker: "0x24691a00779d375A5447727E1610d327D04B3C5F" },
  // Arbitrum
  { key: "real-yield-usd-arb", name: "Real Yield USD", chainId: 42161, kind: "cellar", address: "0x392B1E6905bb8449d26af701Cdea6Ff47bF6e5A8", staker: "0x623987D3CC0d504782bc99BBAc7965fe54917D7D" },
  { key: "real-yield-eth-arb", name: "Real Yield ETH", chainId: 42161, kind: "cellar", address: "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C", staker: "0xd700D39be88fB6b54311f95cCA949C3f6835e236" },
  { key: "test-real-yield-usd-arb", name: "Real Yield USD (test)", chainId: 42161, kind: "cellar", address: "0xA73B0B48E26E4B8B24CeaD149252cc275deE99A6", staker: "0xD7FE9DB494B28c55920700eA6E9347c49290A510" },
  { key: "test-multi-asset-arb", name: "Multi-Asset Deposit (test)", chainId: 42161, kind: "cellar", address: "0x7C3bccC2060F097790D1751f25c73d5065683F88" },
  // Optimism
  { key: "real-yield-eth-opt", name: "Real Yield ETH", chainId: 10, kind: "cellar", address: "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C", staker: "0xd700D39be88fB6b54311f95cCA949C3f6835e236" },
]
