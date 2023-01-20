import { useQuery } from "@tanstack/react-query"
import { getPositon } from "data/actions/common/getPosition"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGetPositionValueQuery } from "generated/subgraph"
import { useCreateContracts } from "./useCreateContracts"

export const usePosition = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const [cellarResult] = useGetPositionValueQuery({
    variables: {
      cellarAddress: config.id,
    },
  })

  const { data } = cellarResult
  const { cellar } = data || {}
  const { positions, positionDistribution } = cellar || {}

  const isEnabled =
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD

  const queryEnabled = Boolean(
    isEnabled &&
      cellarContract.provider &&
      positions &&
      positionDistribution
  )

  const query = useQuery(
    [
      "USE_POSITION",
      positions,
      positionDistribution,
      config.cellar.address,
    ],
    async () => {
      if (isEnabled) {
        return await getPositon(positions, positionDistribution)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}
