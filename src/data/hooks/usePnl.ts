import { useQuery } from "@tanstack/react-query"
import { getPnl as getPnl_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getPnl"
import { CellarKey, ConfigProps } from "data/types"
import { useGetPositionQuery } from "generated/subgraph"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"

export const usePnl = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const { address } = useAccount()
  const { lpToken } = useUserBalances(config)

  const { data: userStakes } = useUserStakes(config)
  const [
    {
      data: positionData,
      fetching: positionFetching,
      error: positionError,
    },
  ] = useGetPositionQuery({
    variables: {
      walletAddress: (address ?? "").toLowerCase(),
    },
    pause: false,
  })

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      cellarContract.provider
  )

  const query = useQuery(
    ["USE_PNL"],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getPnl_AAVE_V2_STABLE_CELLAR({
          cellarContract,
          lpToken: lpToken.data?.formatted,
          positionData,
          userStakes,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED, // branching example: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED || V1_5_CELLAR_QUERY_ENABLED
    }
  )

  return query
}
