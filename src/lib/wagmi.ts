// src/lib/wagmi.ts
import { http, createConfig } from "wagmi"
import type { Connector } from "wagmi"
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
import { createCapturingTransport } from "src/lib/attribution/capture"
import { wrapConnector } from "src/lib/attribution/wallet"

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

let connectors = connectorsForWallets(
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

if (process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true") {
  connectors = connectors.map((c) =>
    wrapConnector(c as unknown as Connector) as unknown as typeof c
  )
}

function getContext() {
  return {
    domain: window.location.hostname,
    pagePath: window.location.pathname + window.location.search,
    sessionId:
      localStorage.getItem("somm_session_id") ||
      (localStorage.setItem("somm_session_id", crypto.randomUUID()),
      localStorage.getItem("somm_session_id") as string),
  }
}

export const config = createConfig({
  connectors,
  chains: [mainnet, arbitrum, optimism, base],
  transports: {
    [mainnet.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: mainnetRpc!,
            getContext,
          })
        : http(mainnetRpc),
    [arbitrum.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: arbitrumRpc!,
            getContext,
          })
        : http(arbitrumRpc),
    [optimism.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: optimismRpc,
            getContext,
          })
        : http(optimismRpc),
    [base.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: baseRpc!,
            getContext,
          })
        : http(baseRpc),
  },
  ssr: true,
})
