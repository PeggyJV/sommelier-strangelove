import { useQuery } from "@tanstack/react-query"
import { getPositon } from "data/actions/common/getPosition"
import { CellarKey, ConfigProps } from "data/types"
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

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
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
      if (
        config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
        config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
      ) {
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
