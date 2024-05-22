import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { mainnet, arbitrum, optimism, scroll } from "wagmi/chains"
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "@wagmi/connectors"

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_WALLETCONNECT_PROJECT_ID || "c11d8ffaefb8ba4361ae510ed7690cb8"

const queryClient = new QueryClient()

// Ensure transports are set up correctly
const alchemyTransport = http(
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
  {
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${ALCHEMY_API_KEY}`,
      },
    },
  }
)
const arbitrumTransport = http(`https://arb1.arbitrum.io/rpc`)
const optimismTransport = http(`https://mainnet.optimism.io`)
const scrollTransport = http(scroll.rpcUrls.default.http[0])

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, scroll],
  connectors: [
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      qrModalOptions: {
        enableExplorer: true
      }
    }),
    metaMask({
      dappMetadata: {
        name: "Sommelier",
        url: "http://https://www.sommelier.finance/",
      },

    }),
    injected(),
    coinbaseWallet({
      appName: "Sommelier",
    }),
  ],
  transports: {
    [mainnet.id]: alchemyTransport,
    [arbitrum.id]: arbitrumTransport,
    [optimism.id]: optimismTransport,
    [scroll.id]: scrollTransport
  },
})

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </QueryClientProvider>
  )
}
