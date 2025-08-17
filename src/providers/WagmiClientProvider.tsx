"use client"
import React, { useEffect, useState } from "react"
import { WagmiProvider, createConfig, http, type Config } from "wagmi"
import { mainnet, arbitrum, optimism } from "wagmi/chains"
import { initWalletCoreOnce } from "utils/wallet/initOnce"

export default function WagmiClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        // Use one-time init guard for WalletConnect
        initWalletCoreOnce(() => {
          // This will only run once per session
        })

        // Dynamic ESM import on client only
        const mod = await import("@wagmi/connectors")
        const walletConnect = mod.walletConnect

        const cfg = createConfig({
          chains: [mainnet, arbitrum, optimism],
          transports: {
            [mainnet.id]: http(),
            [arbitrum.id]: http(),
            [optimism.id]: http(),
          },
          connectors: walletConnect
            ? [
                walletConnect({
                  projectId:
                    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
                  qrModalOptions: { themeMode: "dark" },
                }),
              ]
            : [],
          ssr: false,
        })
        if (!cancelled) setConfig(cfg)
      } catch (error) {
        console.warn("Failed to initialize WalletConnect:", error)
        // Fallback to no connectors so build never crashes
        const cfg = createConfig({
          chains: [mainnet, arbitrum, optimism],
          transports: {
            [mainnet.id]: http(),
            [arbitrum.id]: http(),
            [optimism.id]: http(),
          },
          connectors: [],
          ssr: false,
        })
        if (!cancelled) setConfig(cfg)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  if (!config) return null
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
