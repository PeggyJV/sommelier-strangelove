import { ReactNode } from "react"
import {
  Provider,
  chain,
  defaultChains,
  InjectedConnector,
} from "wagmi"
import { providers } from "ethers"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/"
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const alchemyRpc = `${ALCHEMY_URL}${ALCHEMY_API_KEY}`

const provider = () => {
  return new providers.AlchemyProvider(1, ALCHEMY_API_KEY)
}

const chains = defaultChains
const mainnet = chain.mainnet || defaultChains[4]
const connector = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    // new WalletConnectConnector({
    //   options: {
    //     rpc: {
    //       [mainnet.id]: alchemyRpc
    //     },
    //     chainId: mainnet.id,
    //     qrcode: true
    //   }
    // })
  ]
}

export const WagmiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <Provider autoConnect connectors={connector} provider={provider}>
      {children}
    </Provider>
  )
}
