import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { useGetStrategyDataQuery } from "generated/subgraph"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { cellarDataMap } from "data/cellarDataMap"
import { getBaseApyData } from "data/actions/common/getBaseApyData"

export const useBaseApy = (address: string) => {
  const provider = useProvider()
  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")
  const [{ data: sgData, error }, reFetch] = useGetStrategyDataQuery({
    variables: { cellarAddress: address.toLowerCase() },
  })
  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      address.toLowerCase()
  )!.config
  const isNoSubgraph = Boolean(config!.noSubgraph)
  const query = useQuery(
    ["USE_BASE_APY", { provider: provider?._isProvider, address }],
    async () => {
      const result = await getBaseApyData(config, sgData.)

      return result
    },
    {
      enabled:
        !!allContracts && !!sommPrice && (isNoSubgraph || !!sgData),
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
    refetch: () => {
      reFetch()
      query.refetch()
    },
  }
}
