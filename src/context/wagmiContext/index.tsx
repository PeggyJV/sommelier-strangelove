import { ReactNode } from "react"
import {
  mainnet,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { infuraProvider } from "wagmi/providers/infura"

import { alchemyProvider } from "wagmi/providers/alchemy"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/"
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? ""
const alchemyRpc = `${ALCHEMY_URL}${ALCHEMY_API_KEY}`

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!,
    }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
)

const connector = () => {
  return [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.WALLETCONNECT_PROJECT_ID ?? "",
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
