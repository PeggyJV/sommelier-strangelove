import { useQuery } from "@tanstack/react-query"
import { getUserStakes as getUserStakes_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getUserStakes"
import { ConfigProps, StakerKey } from "data/types"
import { SommStaking } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"

export const useUserStakes = (config: ConfigProps) => {
  const { address } = useAccount()
  const { stakerContract, stakerSigner } = useCreateContracts(config)

  const AAVE_STAKER_QUERY_ENABLED = Boolean(
    address &&
      config.staker?.key === StakerKey.AAVE_STAKER &&
      stakerContract?.provider &&
      stakerSigner?.provider &&
      stakerSigner.signer
  )

  const query = useQuery(
    ["USE_USER_STAKES", address],
    async ({ queryKey: [, _address] }) => {
      if (config.staker?.key === StakerKey.AAVE_STAKER) {
        return await getUserStakes_AAVE_V2_STABLE_CELLAR(
          _address!,
          stakerContract as SommStaking,
          stakerSigner as SommStaking
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_STAKER_QUERY_ENABLED,
    }
  )

  return query
}
