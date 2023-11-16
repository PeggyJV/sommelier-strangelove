import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { useSigner, useProvider } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { ethers } from "ethers"
import { INFURA_API_KEY } from "src/context/rpc_context"

export const useAllContracts = () => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  // Prepare the providers and signers map
  const providerMap = new Map()
  const signerMap = new Map()

  // Current chain
  let chainId = provider.network.chainId

  chainConfig.forEach((chain) => {
    // Only set provider for the current chain
    if (chain.wagmiId !== chainId) {
      // Create a new provider for the non current chain
      providerMap.set(
        chain.id,
        new ethers.providers.JsonRpcProvider(
          `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
        )
      )
    } else {
      // Only set signer for the current chain
      providerMap.set(chain.id, provider)
      signerMap.set(chain.id, signer)
    }
  })

  const query = useQuery(
    [
      "USE_ALL_STRATEGIES_CONTRACTS",
      { signer: signer?._isSigner, provider: provider?._isProvider },
    ],
    () => getAllContracts(providerMap, signerMap)
  )

  return query
}
