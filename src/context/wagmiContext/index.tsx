//Users/henriots/Desktop/sommelier-strangelove-1/src/context/wagmiContext/index.tsx
import { ReactNode } from "react"
import {
  mainnet,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi"
import { arbitrum, optimism } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { infuraProvider } from "wagmi/providers/infura"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

// Environment variable keys
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_WALLETCONNECT_PROJECT_ID
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, optimism],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: INFURA_API_KEY }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
)

const connectors = () => [
  new WalletConnectConnector({
    chains,
    options: {
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    },
  }),
  new MetaMaskConnector({ chains }),
  new InjectedConnector({
    chains,
    options: { shimDisconnect: true },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "Sommelier",
      darkMode: true,
    },
  }),
  // Add any other connectors here
]

const client = createClient({
  autoConnect: true,
  provider,
  connectors: connectors,
  webSocketProvider,
})

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
