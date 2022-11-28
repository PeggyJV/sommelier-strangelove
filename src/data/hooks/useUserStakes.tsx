import { useQuery } from "@tanstack/react-query"
import { getUserStakes } from "data/actions/CELLAR_STAKING/getUserStakes"
import { ConfigProps, StakerKey } from "data/types"
import { SommStaking } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"
import { useSommelierPrice } from "./useSommelierPrice"

export const useUserStakes = (config: ConfigProps) => {
  const { address } = useAccount()
  const { stakerContract, stakerSigner } = useCreateContracts(config)
  const sommPrice = useSommelierPrice()

  const queryEnabled = Boolean(
    config.staker?.key === StakerKey.CELLAR_STAKING &&
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
      if (config.staker?.key === StakerKey.CELLAR_STAKING) {
        return await getUserStakes(
          _address!,
          stakerContract as SommStaking,
          stakerSigner as SommStaking,
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
