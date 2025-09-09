/*
  Vault registry for non-Alpha Sommelier vaults used by data-extraction scripts.
  Excludes Alpha stETH and its deposit helper contracts.
*/

import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env.vercel") })

export type Chain = "mainnet" | "arbitrum" | "optimism" | "scroll"

export interface VaultDef {
  name: string
  address: string
  chain: Chain
  startBlock?: number
}

// Non-Alpha vaults only. Alpha stETH (Boring Vault) excluded.
export const VAULTS: VaultDef[] = [
  {
    name: "AAVE",
    address: "0x7bad5df5e11151dc5ee1a648800057c5c934c0d5",
    chain: "mainnet",
  },
  {
    name: "ETH-BTC-Trend",
    address: "0x6b7f87279982d919bbf85182ddeab179b366d8f2",
    chain: "mainnet",
  },
  {
    name: "ETH-BTC-Momentum",
    address: "0x6e2dac3b9e9adc0cbbae2d0b9fd81952a8d33872",
    chain: "mainnet",
  },
  {
    name: "Steady-ETH",
    address: "0x3f07a84ecdf494310d397d24c1c78b041d2fa622",
    chain: "mainnet",
  },
  {
    name: "Steady-BTC",
    address: "0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d",
    chain: "mainnet",
  },
  {
    name: "Steady-UNI",
    address: "0x6f069f711281618467dae7873541ecc082761b33",
    chain: "mainnet",
  },
  {
    name: "Steady-MATIC",
    address: "0x05641a27c82799aaf22b436f20a3110410f29652",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-USD",
    address: "0x97e6e0a40a3d02f12d1cec30ebfbae04e37c119e",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-ETH",
    address: "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-LINK",
    address: "0x4068bdd217a45f8f668ef19f1e3a1f043e4c4934",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-ENS",
    address: "0x18ea937aba6053bc232d9ae2c42abe7a8a2be440",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-1Inch",
    address: "0xc7b69e15d86c5c1581dacce3cacaf5b68cd6596f",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-SNX",
    address: "0xcbf2250f33c4161e18d4a2fa47464520af5216b5",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-UNI",
    address: "0x6a6af5393dc23d7e3db28d28ef422db7c40932b6",
    chain: "mainnet",
  },
  {
    name: "Real-Yield-BTC",
    address: "0x0274a704a6d9129f90a62ddc6f6024b33ecdad36",
    chain: "mainnet",
  },
  {
    name: "Fraximal",
    address: "0xdbe19d1c3f21b1bb250ca7bdae0687a97b5f77e6",
    chain: "mainnet",
  },
  {
    name: "DeFi-Stars",
    address: "0x03df2a53cbed19b824347d6a45d09016c2d1676a",
    chain: "mainnet",
  },
  {
    name: "Turbo-SWETH",
    address: "0xd33dad974b938744dac81fe00ac67cb5aa13958e",
    chain: "mainnet",
  },
  {
    name: "ETH-Trend-Growth",
    address: "0x6c51041a91c91c86f3f08a72cb4d3f67f1208897",
    chain: "mainnet",
  },
  {
    name: "Turbo-GHO",
    address: "0x0C190DEd9Be5f512Bd72827bdaD4003e9Cc7975C",
    chain: "mainnet",
  },
  {
    name: "Turbo-SOMM",
    address: "0x5195222f69c5821f8095ec565E71e18aB6A2298f",
    chain: "mainnet",
  },
  {
    name: "Turbo-eETH",
    address: "0x9a7b4980C6F0FCaa50CD5f288Ad7038f434c692e",
    chain: "mainnet",
  },
  {
    name: "Turbo-STETH",
    address: "0xfd6db5011b171b05e1ea3b92f9eacaeeb055e971",
    chain: "mainnet",
  },
  {
    name: "Turbo-STETH-(steth-deposit)",
    address: "0xc7372Ab5dd315606dB799246E8aA112405abAeFf",
    chain: "mainnet",
  },
  {
    name: "Morpho-ETH",
    address: "0xcf4B531b4Cde95BD35d71926e09B2b54c564F5b6",
    chain: "mainnet",
  },
  {
    name: "Turbo-divETH",
    address: "0x6c1edce139291Af5b84fB1e496c9747F83E876c9",
    chain: "mainnet",
  },
  {
    name: "Turbo-ETHx",
    address: "0x19B8D8FC682fC56FbB42653F68c7d48Dd3fe597E",
    chain: "mainnet",
  },
  {
    name: "Turbo-eETHV2",
    address: "0xdAdC82e26b3739750E036dFd9dEfd3eD459b877A",
    chain: "mainnet",
  },
  {
    name: "Turbo-rsETH",
    address: "0x1dffb366b5c5A37A12af2C127F31e8e0ED86BDbe",
    chain: "mainnet",
  },
  {
    name: "Turbo-ezETH",
    address: "0x27500De405a3212D57177A789E30bb88b0AdbeC5",
    chain: "mainnet",
  },

  // L2 vaults
  {
    name: "real-yield-eth-arb",
    address: "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C",
    chain: "arbitrum",
  },
  {
    name: "real-yield-usd-arb",
    address: "0x392B1E6905bb8449d26af701Cdea6Ff47bF6e5A8",
    chain: "arbitrum",
  },
  {
    name: "real-yield-eth-opt",
    address: "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C",
    chain: "optimism",
  },
  {
    name: "real-yield-eth-scroll",
    address: "0xd3bb04423b0c98abc9d62f201212f44dc2611200",
    chain: "scroll",
  },
]

export const RPC: Record<Chain, string> = {
  mainnet: process.env.RPC_MAINNET ?? "",
  arbitrum: process.env.RPC_ARBITRUM ?? "",
  optimism: process.env.RPC_OPTIMISM ?? "",
  scroll: process.env.RPC_SCROLL ?? "",
}

// Addresses of Alpha stETH (Boring Vault) contracts to be excluded in certain scripts
export const ALPHA_STETH: string[] = [
  "0xef417fce1883c6653e7dc6af7c6f85ccde84aa09",
]
