"use client"
import React, { useEffect } from "react"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "../lib/wagmi"
import "@rainbow-me/rainbowkit/styles.css"
import { patchGlobalEthereumForSubmittedCapture } from "../lib/attribution/patchEip1193"

export default function WagmiClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true") {
      patchGlobalEthereumForSubmittedCapture()
    }
  }, [])
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  )
}
