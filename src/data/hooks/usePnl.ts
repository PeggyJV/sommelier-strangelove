import { useQuery } from "@tanstack/react-query"
import { CellarKey, ConfigProps } from "data/types"
import { useGetPositionQuery } from "generated/subgraph"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount } from "wagmi"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"
import { getPnl } from "data/actions/common/getPnl"

export const usePnl = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const { address } = useAccount()
  const { lpToken } = useUserBalances(config)

  const { data: userStakes } = useUserStakes(config)

  const cellarAddress = config.cellar.address.toLowerCase()
  const walletCellarId = `${(
    address ?? ""
  ).toLowerCase()}-${cellarAddress}`
  const [
    {
      data: positionData,
      fetching: positionFetching,
      error: positionError,
    },
  ] = useGetPositionQuery({
    variables: { walletCellarId },
    pause: false,
  })

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.CELLAR_V0815 ||
      config.cellar.key === CellarKey.CELLAR_V0816) &&
      cellarContract.provider
  )

  const query = useQuery(
    ["USE_PNL", lpToken.data?.formatted, config.cellar.address],
    async () => {
      if (
        config.cellar.key === CellarKey.CELLAR_V0815 ||
        config.cellar.key === CellarKey.CELLAR_V0816
      ) {
        return await getPnl({
          cellarContract,
          lpToken: lpToken.data?.formatted,
          positionData,
          userStakes,
        })
      }

      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}
