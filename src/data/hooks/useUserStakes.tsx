import { useQuery } from "@tanstack/react-query"
import { getUserStakes } from "data/actions/CELLAR_STAKING_V0815/getUserStakes"
import { ConfigProps, StakerKey } from "data/types"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { CellarStakingV0815 } from "src/abi/types"

export const useUserStakes = (config: ConfigProps) => {
  const { address } = useAccount()
  const { stakerContract, stakerSigner } = useCreateContracts(config)
  const sommPrice = useCoinGeckoPrice("sommelier")

  const queryEnabled = Boolean(
    config.staker?.key === StakerKey.CELLAR_STAKING_V0815 &&
      sommPrice.data &&
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
      if (config.staker?.key === StakerKey.CELLAR_STAKING_V0815) {
        return await getUserStakes(
          _address!,
          stakerContract as CellarStakingV0815,
          stakerSigner as CellarStakingV0815,
          sommPrice.data
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled && Boolean(sommPrice.data),
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
