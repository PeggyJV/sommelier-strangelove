import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { mainnet, arbitrum, optimism } from "wagmi/chains"
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "@wagmi/connectors"

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_WALLETCONNECT_PROJECT_ID ||
  "c11d8ffaefb8ba4361ae510ed7690cb8"

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

const config = createConfig({
  chains: [mainnet, arbitrum, optimism],
  connectors: [
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      chains: [mainnet, arbitrum, optimism],
      options: {
        qrcode: true,
      },
    }),
    metaMask({
      chains: [mainnet, arbitrum, optimism],
      options: {
        dAppMetadata: {
          name: "Sommelier",
          url: "http://https://www.sommelier.finance/",
        },
      },
    }),
    injected({
      chains: [mainnet, arbitrum, optimism],
    }),
    coinbaseWallet({
      chains: [mainnet, arbitrum, optimism],
      options: { appName: "Sommelier" },
    }),
  ],
  transports: {
    [mainnet.id]: alchemyTransport,
    [arbitrum.id]: arbitrumTransport,
    [optimism.id]: optimismTransport,
  },
})

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </QueryClientProvider>
  )
}
