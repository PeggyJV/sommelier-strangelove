// src/lib/wagmi.ts
import { createConfig, http } from "wagmi"
import { mainnet, arbitrum, base, optimism } from "wagmi/chains"
import { walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, arbitrum, optimism, base],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_RPC),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC),
    [optimism.id]: http(
      process.env.NEXT_PUBLIC_OPTIMISM_RPC || "https://mainnet.optimism.io"
    ),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC),
  },
})
