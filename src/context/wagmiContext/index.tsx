import { ReactNode, useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { mainnet, arbitrum, optimism, scroll } from "wagmi/chains"
import {
  coinbaseWallet,
  injected,
  walletConnect,
  safe,
} from "@wagmi/connectors"
import { ALCHEMY_API_KEY, ALCHEMY_API_URL } from "context/rpc_context"

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "c11d8ffaefb8ba4361ae510ed7690cb8"

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, scroll],
  connectors: [
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      qrModalOptions: {
        enableExplorer: true,
        themeMode: "dark",
      },
    }),
    // MetaMask connector produces type error in production.
    // "Injected" creates metamask option in case user has MetaMask has installed.
    // Need to find a solution to display the option when MetaMask isn't installed.
    // metaMask({
    //   dappMetadata: {
    //     name: "Somm Finance",
    //     url: "https://www.somm.finance/",
    //   }
    // }),
    injected(),
    coinbaseWallet({
      appName: "Somm Finance",
    }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(
      `${ALCHEMY_API_URL.ethereum}/${ALCHEMY_API_KEY}`
    ),
    [arbitrum.id]: http(
      `${ALCHEMY_API_URL.arbitrum}/${ALCHEMY_API_KEY}`
    ),
    [optimism.id]: http(
      `${ALCHEMY_API_URL.optimism}/${ALCHEMY_API_KEY}`
    ),
    [scroll.id]: http(scroll.rpcUrls.default.http[0]),
  },
})

export const QueryProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
