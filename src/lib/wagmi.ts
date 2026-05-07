// src/lib/wagmi.ts
import { http, createConfig } from "wagmi"
import { mainnet, arbitrum, base, optimism } from "wagmi/chains"
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY

// Build RPC URLs: prefer explicit env vars, fall back to Alchemy key
const mainnetRpc =
  process.env.NEXT_PUBLIC_MAINNET_RPC ||
  (alchemyKey && `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`)
const arbitrumRpc =
  process.env.NEXT_PUBLIC_ARBITRUM_RPC ||
  (alchemyKey && `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`)
const optimismRpc =
  process.env.NEXT_PUBLIC_OPTIMISM_RPC ||
  (alchemyKey && `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`) ||
  "https://mainnet.optimism.io"
const baseRpc = process.env.NEXT_PUBLIC_BASE_RPC

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        safeWallet,
        injectedWallet,
        metaMaskWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "Sommelier",
    projectId,
  }
)

export const config = createConfig({
  connectors,
  chains: [mainnet, arbitrum, optimism, base],
  transports: {
    [mainnet.id]: http(mainnetRpc),
    [arbitrum.id]: http(arbitrumRpc),
    [optimism.id]: http(optimismRpc),
    [base.id]: http(baseRpc),
  },
  ssr: true,
})
