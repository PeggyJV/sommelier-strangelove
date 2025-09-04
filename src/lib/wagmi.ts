// src/lib/wagmi.ts
import { http, createConfig } from "wagmi"
import { mainnet, arbitrum, base, optimism } from "wagmi/chains"
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
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
