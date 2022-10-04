import { useQuery } from "@tanstack/react-query"
import { getApy as getApy_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getApy"
import { CellarKey, ConfigProps } from "data/types"
import { AaveV2CellarV2, SommStaking } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useSommelierPrice } from "./useSommelierPrice"

export const useApy = (config: ConfigProps) => {
  const { cellarContract, stakerContract } =
    useCreateContracts(config)

  const sommPrice = useSommelierPrice()

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      cellarContract.provider &&
      stakerContract?.provider
  )
  const CLEAR_GATE_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
  )

  const query = useQuery(
    ["USE_APY"],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getApy_AAVE_V2_STABLE_CELLAR(
          cellarContract as AaveV2CellarV2,
          stakerContract as SommStaking,
          sommPrice.data
        )
      }
      if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) {
        // the value is overridden from cellarDataMap.overrideApy
        return null
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled:
        (AAVE_V2_STABLE_CELLAR_QUERY_ENABLED ||
          CLEAR_GATE_QUERY_ENABLED) &&
        Boolean(sommPrice.data),
    }
  )

  return {
    ...query,
    isLoading: sommPrice.isLoading || query.isLoading,
    isFetching: sommPrice.isFetching || query.isFetching,
    isRefetching: sommPrice.isRefetching || query.isRefetching,
    isError: sommPrice.isError || query.isError,
    error: sommPrice.error || query.error,
  }
}
