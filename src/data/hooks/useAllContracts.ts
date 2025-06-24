import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import {
  http,
  useAccount,
  usePublicClient,
} from "wagmi"
import { chainConfig } from "data/chainConfig"
import { INFURA_API_KEY } from "src/context/rpc_context"
import { createPublicClient } from "viem"
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"

export const useAllContracts = () => {
  const publicClient = usePublicClient()
  const { isConnected } = useAccount()

  const walletClient = isConnected
    ? createWalletClient({
        chain: publicClient?.chain,
        transport: custom(window.ethereum!),
      })
    : undefined

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
