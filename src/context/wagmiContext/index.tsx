import { ReactNode } from "react"
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { InjectedConnector } from "wagmi/connectors/injected"
import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/"
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const alchemyRpc = `${ALCHEMY_URL}${ALCHEMY_API_KEY}`

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]
)

const connector = () => {
  return [
    // @ts-ignore
    new SafeConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
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
