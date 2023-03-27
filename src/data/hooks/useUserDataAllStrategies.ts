import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useGetAllStrategiesDataQuery } from "generated/subgraph"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

export const useUserDataAllStrategies = () => {
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const sommPrice = useCoinGeckoPrice("sommelier")
  const [{ data: sgData, error }, reFetch] =
    useGetAllStrategiesDataQuery()

  const query = useQuery(
    [
      "USE_USER_DATA_ALL_STRATEGIES",
      {
        allContracts: !!allContracts,
        signer: signer?._isSigner,
        userAddress: address,
      },
    ],
    async () => {
      return await getUserDataAllStrategies({
        allContracts: allContracts!,
        strategiesData: strategies.data!,
        userAddress: address!,
        sommPrice: sommPrice.data!,
        sgData: sgData!,
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!strategies.data &&
        !!address &&
        !!sommPrice.data &&
        !!sgData,
    }
  )
  return query
}
