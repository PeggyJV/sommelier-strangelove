import { useQuery } from "@tanstack/react-query"
import { getUserStakes as getUserStakes_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getUserStakes"
import { ConfigProps, StakerKey } from "data/types"
import { SommStaking } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"
import { useSommelierPrice } from "./useSommelierPrice"

export const useUserStakes = (config: ConfigProps) => {
  const { address } = useAccount()
  const { stakerContract, stakerSigner } = useCreateContracts(config)
  const sommPrice = useSommelierPrice()

  const AAVE_STAKER_QUERY_ENABLED = Boolean(
    config.staker?.key === StakerKey.AAVE_STAKER &&
      address &&
      stakerContract?.provider &&
      stakerSigner?.provider &&
      stakerSigner.signer
  )

  const query = useQuery(
    [
      "USE_USER_STAKES",
      address,
      sommPrice.data,
      config.staker?.address,
    ],
    async ({ queryKey: [, _address] }) => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }
      if (config.staker?.key === StakerKey.AAVE_STAKER) {
        return await getUserStakes_AAVE_V2_STABLE_CELLAR(
          _address!,
          stakerContract as SommStaking,
          stakerSigner as SommStaking,
          sommPrice.data
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_STAKER_QUERY_ENABLED && Boolean(sommPrice.data),
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
