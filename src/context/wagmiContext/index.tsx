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
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_WALLETCONNECT_PROJECT_ID
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, optimism],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY! }),
    infuraProvider({
      apiKey: INFURA_API_KEY!,
    }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
)

const connector = () => {
  console.log("WALLETCONNECT_PROJECT_ID", WALLETCONNECT_PROJECT_ID)

  return [
    new WalletConnectConnector({
      chains,
      options: {
        projectId:
          WALLETCONNECT_PROJECT_ID ||
          "c11d8ffaefb8ba4361ae510ed7690cb8",
        showQrModal: true,
      },
    }),
    new MetaMaskConnector({
      chains,
    }),
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
  ]
}

const client = createClient({
  autoConnect: true,
  provider,
  // @ts-ignore
  connectors: connector,
  webSocketProvider,
})

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
