import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { http, usePublicClient, useWalletClient } from "wagmi"
import { chainConfig } from "data/chainConfig"
import {
  INFURA_API_KEY,
  ALCHEMY_API_KEY,
} from "src/context/rpc_context"
import { createPublicClient } from "viem"

export const useAllContracts = () => {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  const query = useQuery({
    queryKey: [
      "USE_ALL_STRATEGIES_CONTRACTS",
      publicClient?.chain?.id,
    ],
    queryFn: () => {
      const providerMap = new Map()
      const signerMap = new Map()

      const chainId = publicClient?.chain?.id

      chainConfig.forEach((chain) => {
        // Always use paid RPC providers for reads instead of wallet's public client
        // Priority: Alchemy > Infura > fallback to public RPC
        let rpcUrl: string | undefined

        if (chain.alchemyRpcUrl && ALCHEMY_API_KEY) {
          rpcUrl = `${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
        } else if (chain.infuraRpcUrl && INFURA_API_KEY) {
          rpcUrl = `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
        }
        // If neither paid provider is available, http() without URL will use public RPCs

        providerMap.set(
          chain.id,
          createPublicClient({
            chain: chain.viemChain,
            transport: http(rpcUrl),
          })
        )

        // Only set signer when chain matches the connected wallet
        if (chain.wagmiId === chainId) {
          signerMap.set(chain.id, walletClient)
        }
      })

      return getAllContracts(providerMap, signerMap)
    },
    enabled: !!publicClient?.chain?.id,
  })

  return query
}
