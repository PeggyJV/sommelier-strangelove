import { useQuery } from "@tanstack/react-query"
import { getTvm as getTvm_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getTvm"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
import { AaveV2CellarV2 } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"

export const useTvm = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const { tvlTotal } = cellar || {}

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      cellarContract.provider &&
      tvlTotal
  )

  const query = useQuery(
    ["USE_TVM", config.cellar.address, tvlTotal],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getTvm_AAVE_V2_STABLE_CELLAR(
          cellarContract as AaveV2CellarV2,
          tvlTotal
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED, // branching example: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED || V1_5_CELLAR_QUERY_ENABLED
    }
  )

  return query
}
