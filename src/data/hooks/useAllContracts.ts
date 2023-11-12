import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { useSigner, useProvider } from "wagmi"
import { chainConfig } from "data/chainConfig"

export const useAllContracts = () => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  // Prepare the providers and signers map
  const providerMap = new Map()
  const signerMap = new Map()

  chainConfig.forEach((chain) => {
    providerMap.set(chain.id, provider)
    signerMap.set(chain.id, signer)
  })

  const query = useQuery(
    ["USE_ALL_STRATEGIES_CONTRACTS"],
    () => getAllContracts(providerMap, signerMap),
    {
      // If you want to enable/disable this query based on the presence of provider/signer
      enabled: !!provider && !!signer,
    }
  )

  return query
}
