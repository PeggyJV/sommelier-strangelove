import { ReactNode } from "react"
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
} from "@wagmi/connectors"

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "c11d8ffaefb8ba4361ae510ed7690cb8"

const queryClient = new QueryClient()
export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, scroll],
  connectors: [
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      qrModalOptions: {
        enableExplorer: true,
      },
    }),
    injected({ target: 'metaMask' }),
    coinbaseWallet({
      appName: "Sommelier",
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`),
    [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
    [optimism.id]: http(optimism.rpcUrls.default.http[0]),
    [scroll.id]: http(scroll.rpcUrls.default.http[0])
  },
})

export const QueryProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
