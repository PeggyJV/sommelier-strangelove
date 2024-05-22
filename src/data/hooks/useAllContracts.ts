import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { http, usePublicClient, useWalletClient } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { INFURA_API_KEY } from "src/context/rpc_context"
import { createPublicClient } from "viem"

export const useAllContracts = () => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  // Prepare the providers and signers map
  const providerMap = new Map()
  const signerMap = new Map()

  // Current chain
  let chainId = publicClient?.chain.id

  chainConfig.forEach((chain) => {
    // Only set provider for the current chain
    if (chain.wagmiId !== chainId) {
      // Create a new provider for the non-current chain
      providerMap.set(
        chain.id,
        createPublicClient({
          chain: chain.viemChain,
          transport: http(chain.infuraRpcUrl)
        })
      )
    } else {
      // Only set signer for the current chain
      providerMap.set(chain.id, publicClient)
      signerMap.set(chain.id, walletClient)
    }
  })

  const query = useQuery({
    queryKey: [
      "USE_ALL_STRATEGIES_CONTRACTS",
      { signer: walletClient, provider: publicClient },
    ],
    queryFn:() => getAllContracts(providerMap, signerMap)
  }
  )

  return query
}
