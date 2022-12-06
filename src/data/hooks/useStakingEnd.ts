import { useQuery } from "@tanstack/react-query"
import { ConfigProps, StakerKey } from "data/types"
import { useCreateContracts } from "./useCreateContracts"
import { CellarStakingV0815 } from "src/abi/types"
import { getStakingEnd } from "data/actions/CELLAR_STAKING_V0815/getStakingEnd"

export const useStakingEnd = (config: ConfigProps) => {
  const { stakerContract } = useCreateContracts(config)

  const queryEnabled = Boolean(
    config.staker?.key === StakerKey.CELLAR_STAKING_V0815 &&
      stakerContract?.provider
  )

  const query = useQuery(
    ["USE_STAKING_END", config.staker?.address],
    async () => {
      if (config.staker?.key === StakerKey.CELLAR_STAKING_V0815) {
        return await getStakingEnd(
          stakerContract as CellarStakingV0815
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}
