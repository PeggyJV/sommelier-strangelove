import { useQuery } from "@tanstack/react-query"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"
import { useAccount, useSigner } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useAllStrategiesData } from "./useAllStrategiesData"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { fetchGraphCellarStrategyData } from "queries/get-all-strategies-data"
import { useState, useEffect } from "react"
import { GetAllStrategiesDataQuery } from "generated/subgraph"

export const useUserDataAllStrategies = () => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { data: allContracts } = useAllContracts()
  const strategies = useAllStrategiesData()
  const sommPrice = useCoinGeckoPrice("sommelier")

  const [sgData, setSgData] = useState<
    GetAllStrategiesDataQuery | undefined>(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGraphCellarStrategyData()
      .then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setSgData(data)
        }
      })
      .catch((error) => setError(error))
  }, [])

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
        sgData: sgData,
      })
    },
    {
      enabled:
        !!allContracts &&
        !!signer?._isSigner &&
        !!strategies.data &&
        !!address &&
        !!sommPrice.data &&
        !!sgData?.cellars,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}
