import { useQuery } from "@tanstack/react-query"
import { getAllStrategiesData } from "data/actions/common/getAllStrategiesData"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

export const useAllStrategiesData = () => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")

  const query = useQuery(
    ["USE_ALL_STRATEGIES_DATA", { provider: provider?._isProvider }],
    async () => {
      return await getAllStrategiesData({
        allContracts: allContracts!,
        sommPrice: sommPrice!,
      })
    },
    {
      enabled: !!allContracts && !!sommPrice,
    }
  )
  return query
}