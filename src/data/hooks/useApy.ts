import { useQuery } from "@tanstack/react-query"
import { getApy as getApy_AAVE_V2_STABLE_CELLAR } from "data/actions/CELLAR_V0815/getApy"
import { CellarNameKey, ConfigProps } from "data/types"
import { CellarStakingV0815, CellarV0815 } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useSommelierPrice } from "./useSommelierPrice"

export const useApy = (config: ConfigProps) => {
  const { cellarContract, stakerContract } =
    useCreateContracts(config)

  const sommPrice = useSommelierPrice()

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellarNameKey === CellarNameKey.AAVE &&
      cellarContract.provider &&
      stakerContract?.provider
  )

  const query = useQuery(
    ["USE_APY", sommPrice.data, config.cellar.address],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }
      if (config.cellarNameKey === CellarNameKey.AAVE) {
        return await getApy_AAVE_V2_STABLE_CELLAR(
          cellarContract as CellarV0815,
          stakerContract as CellarStakingV0815,
          sommPrice.data
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled:
        AAVE_V2_STABLE_CELLAR_QUERY_ENABLED &&
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
