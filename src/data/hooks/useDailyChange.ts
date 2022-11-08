import { useQuery } from "@tanstack/react-query"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
import { toInteger } from "lodash"
import { useCreateContracts } from "./useCreateContracts"

export const useDailyChange = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })

  const { data } = cellarResult
  const { cellar } = data || {}
  const { dayDatas } = cellar || {}

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
      cellarContract.provider &&
      dayDatas
  )

  const query = useQuery(
    ["USE_DAILY_CHANGE", dayDatas, config.cellar.address],
    async () => {
      const percentage =
        dayDatas &&
        ((toInteger(dayDatas[0].shareValue) -
          toInteger(dayDatas[1].shareValue)) /
          toInteger(dayDatas[1].shareValue)) *
          100
      if (
        config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
        config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
      ) {
        return percentage
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}
