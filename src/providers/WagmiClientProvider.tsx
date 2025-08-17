"use client"
import React, { useMemo } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, arbitrum, optimism } from "wagmi/chains"
import { initWalletCoreOnce } from "utils/wallet/initOnce"

export default function WagmiClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const config = useMemo(() => {
    // Avoid importing walletconnect at module scope; only on client
    let walletConnect: null | ((...args: any[]) => any) = null
    initWalletCoreOnce(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("@wagmi/connectors")
      walletConnect = mod.walletConnect ?? null
    })

    return createConfig({
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
  }, [])

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
