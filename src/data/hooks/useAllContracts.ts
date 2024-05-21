import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { usePublicClient, useWalletClient } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { ethers } from "ethers"
import { INFURA_API_KEY } from "src/context/rpc_context"

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
        new ethers.providers.JsonRpcProvider(
          `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
        )
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
