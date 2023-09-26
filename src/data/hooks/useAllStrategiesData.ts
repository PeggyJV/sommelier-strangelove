import { useQuery } from "@tanstack/react-query"
import { getAllStrategiesData } from "data/actions/common/getAllStrategiesData"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { fetchCellarStrategyData } from "queries/get-all-strategies-data"
import { useState, useEffect } from "react"
import { GetAllStrategiesDataQuery } from "data/actions/types"

export const useAllStrategiesData = () => {
  const provider = useProvider()
  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")

  const [cellarData, setcellarData] = useState<
    GetAllStrategiesDataQuery | undefined
  >(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCellarStrategyData()
      .then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setcellarData(data)
        }
      })
      .catch((error) => setError(error))
  }, [])

  const query = useQuery(
    ["USE_ALL_STRATEGIES_DATA", { provider: provider?._isProvider }],
    async () => {
      return await getAllStrategiesData({
        allContracts: allContracts!,
        sommPrice: sommPrice!,
        cellarData: cellarData,
      })
    },
    {
      enabled: !!allContracts && !!sommPrice && !!cellarData,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}
