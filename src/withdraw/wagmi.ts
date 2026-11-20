import { http, createConfig } from "wagmi"
import { mainnet, arbitrum, optimism } from "wagmi/chains"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const rpc = (explicit: string | undefined, alchemyHost: string, fallback: string) =>
  explicit || (alchemyKey ? `https://${alchemyHost}.g.alchemy.com/v2/${alchemyKey}` : fallback)

const connectors = connectorsForWallets(
  [
    {
      groupName: "Wallets",
      wallets: [safeWallet, injectedWallet, metaMaskWallet, rainbowWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
  { appName: "Somm Withdrawals", projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "" }
)

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(rpc(process.env.NEXT_PUBLIC_MAINNET_RPC, "eth-mainnet", "https://ethereum-rpc.publicnode.com"), { batch: true }),
    [arbitrum.id]: http(rpc(process.env.NEXT_PUBLIC_ARBITRUM_RPC, "arb-mainnet", "https://arbitrum-one-rpc.publicnode.com"), { batch: true }),
    [optimism.id]: http(rpc(process.env.NEXT_PUBLIC_OPTIMISM_RPC, "opt-mainnet", "https://optimism-rpc.publicnode.com"), { batch: true }),
  },
  ssr: true,
})
