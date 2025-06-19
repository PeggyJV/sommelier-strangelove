import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import {
  http,
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi"
import { chainConfig } from "data/chainConfig"
import { INFURA_API_KEY } from "src/context/rpc_context"
import { createPublicClient } from "viem"

const useWalletClientConditional = () => {
  const { isConnected } = useAccount()
  if (!isConnected) {
    return { data: undefined }
  }
  return useWalletClient()
}

export const useAllContracts = () => {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClientConditional()

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
        if (chain.wagmiId !== chainId) {
          providerMap.set(
            chain.id,
            createPublicClient({
              chain: chain.viemChain,
              transport: http(
                `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
              ),
            })
          )
        } else {
          providerMap.set(chain.id, publicClient)
          signerMap.set(chain.id, walletClient)
        }
      })

      return getAllContracts(providerMap, signerMap)
    },
    enabled: !!publicClient?.chain?.id,
  })

  return query
}
