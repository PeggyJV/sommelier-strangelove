import { useQuery } from "@tanstack/react-query"
import { getAllContracts } from "data/actions/common/getAllContracts"
import { useProvider, useSigner } from "wagmi"

export const useAllContracts = () => {
  const { data: signer } = useSigner()
  const provider = useProvider()
  const query = useQuery(
    [
      "USE_ALL_STRATEGIES_CONTRACTS",
      { signer: signer?._isSigner, provider: provider?._isProvider },
    ],
    getAllContracts
  )
  return query
}
