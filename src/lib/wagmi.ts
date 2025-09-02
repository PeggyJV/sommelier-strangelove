// src/lib/wagmi.ts
import { http } from "wagmi"
import { mainnet, arbitrum, base, optimism } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

// Use RainbowKit's default config so the Connect modal shows common wallets
// including WalletConnect and Ledger by default.
export const config = getDefaultConfig({
  appName: "Sommelier",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, arbitrum, optimism, base],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_RPC),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC),
    [optimism.id]: http(
      process.env.NEXT_PUBLIC_OPTIMISM_RPC ||
        "https://mainnet.optimism.io"
    ),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC),
  },
  ssr: true,
})
