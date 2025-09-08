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
import { createCapturingTransport } from "src/lib/attribution/capture"
import { wrapConnector } from "src/lib/attribution/wallet"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const rkConnectors = connectorsForWallets(
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

// Always resolve to an ARRAY first (handle factory form)
const baseConnectors: any[] =
  typeof rkConnectors === "function" ? rkConnectors() : rkConnectors

// Conditionally wrap for attribution capture
const connectors: any[] =
  process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
    ? baseConnectors.map((c: any) => wrapConnector(c))
    : baseConnectors

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
            url: process.env.NEXT_PUBLIC_MAINNET_RPC!,
            getContext,
          })
        : http(process.env.NEXT_PUBLIC_MAINNET_RPC),
    [arbitrum.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: process.env.NEXT_PUBLIC_ARBITRUM_RPC!,
            getContext,
          })
        : http(process.env.NEXT_PUBLIC_ARBITRUM_RPC),
    [optimism.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url:
              process.env.NEXT_PUBLIC_OPTIMISM_RPC ||
              "https://mainnet.optimism.io",
            getContext,
          })
        : http(
            process.env.NEXT_PUBLIC_OPTIMISM_RPC ||
              "https://mainnet.optimism.io"
          ),
    [base.id]:
      process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
        ? createCapturingTransport({
            url: process.env.NEXT_PUBLIC_BASE_RPC!,
            getContext,
          })
        : http(process.env.NEXT_PUBLIC_BASE_RPC),
  },
  ssr: true,
})
