import { ReactNode } from "react"
import {
  configureChains,
  createClient,
  WagmiConfig,
  mainnet,
} from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { InjectedConnector } from "wagmi/connectors/injected"
import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/"
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const alchemyRpc = `${ALCHEMY_URL}${ALCHEMY_API_KEY}`

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY || "" })]
)

const connector = () => {
  return [
    // @ts-ignore
    new SafeConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.WALLETCONNECT_PROJECT_I || "",
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
  webSocketProvider,
  // @ts-ignore
  connectors: connector,
})

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
