import { useQuery } from "@tanstack/react-query"
import { useAccount, useToken } from "wagmi"
import { useCellarShareBalance } from "../cellar/useCellarShareBalance"
import { calculateUserData } from "src/composite-data/actions/calculate/userData"
import { useCellarData } from "../cellar/useCellarData"
import { useStakerUserData } from "../staker/useStakerUserData"
import { useUserBalances } from "./useUserBalances"
import { useGetPositionQuery } from "generated/subgraph"
import { ConfigProps } from "data/cellarDataMap"
import { useCreateContracts } from "./useCreateContracts"

export const useOutputUserData = (config: ConfigProps) => {
  const [{ data: account }] = useAccount()

  const { stakerSigner, stakerContract, cellarContract } =
    useCreateContracts(config)

  const [
    {
      data: positionData,
      fetching: positionFetching,
      error: positionError,
    },
  ] = useGetPositionQuery({
    variables: {
      walletAddress: (account?.address ?? "").toLowerCase(),
    },
    pause: false,
  })

  const { data: cellarData, refetch: refetchCellarData } =
    useCellarData({
      cellar: {
        contract: cellarContract,
        key: config.cellar.key,
      },
    })

  const userStakeData = useStakerUserData({
    staker: {
      contract: stakerContract,
      key: config.staker.key,
      signer: stakerSigner,
    },
  })

  const { lpToken } = useUserBalances(config)

  const cellarShareBalance = useCellarShareBalance({
    cellar: {
      key: config.cellar.key,
      contract: cellarContract,
    },
    staker: {
      contract: stakerContract,
      key: config.staker.key,
      signer: stakerSigner,
    },
    totalBondedAmount: userStakeData.data?.totalBondedAmount,
    lpToken: lpToken[0],
  })

  const [{ data: aAssetToken }] = useToken({
    address: cellarData?.activeAsset,
  })

  const queryKey = [
    "CALCULATE_USER_DATA",
    {
      aAssetDecimals: aAssetToken?.decimals,
      cellarShareBalance: cellarShareBalance.data,
      claimAllRewardsUSD: userStakeData.data?.claimAllRewardsUSD,
      totalBondedAmount: userStakeData.data?.totalBondedAmount,
      totalClaimAllRewards: userStakeData.data?.totalClaimAllRewards,
      positionData,
    },
    account?.address,
  ] as const

  const query = useQuery(
    queryKey,
    ({
      queryKey: [
        ,
        {
          aAssetDecimals,
          cellarShareBalance,
          claimAllRewardsUSD,
          totalBondedAmount,
          totalClaimAllRewards,
          positionData,
        },
      ],
    }) =>
      calculateUserData({
        aAssetDecimals,
        cellarShareBalance,
        claimAllRewardsUSD,
        totalBondedAmount,
        totalClaimAllRewards,
        positionData,
      }),
    {
      enabled: Boolean(
        aAssetToken?.decimals &&
          cellarShareBalance.data &&
          userStakeData.data?.claimAllRewardsUSD &&
          userStakeData.data?.totalBondedAmount &&
          userStakeData.data?.totalClaimAllRewards &&
          account?.address &&
          cellarData &&
          positionData
      ),
    }
  )

  const result = {
    ...query.data,
    userStake: userStakeData.data,
    activeAsset: aAssetToken,
    lpToken,
    positionData,
  }

  const refetchAll = () => {
    const refetchBalances = lpToken[1]
    void refetchBalances()
    void cellarShareBalance.refetch()
    void refetchCellarData
    void userStakeData.refetch()
  }

  return {
    data: result,
    error:
      query.error ||
      userStakeData.error ||
      cellarShareBalance.error ||
      positionError,
    isFetching:
      query.isFetching ||
      userStakeData.isFetching ||
      cellarShareBalance.isFetching ||
      positionFetching,
    isLoading:
      query.isLoading ||
      userStakeData.isLoading ||
      cellarShareBalance.isLoading ||
      positionFetching,
    isRefetching:
      query.isRefetching ||
      userStakeData.isRefetching ||
      cellarShareBalance.isRefetching,
    refetch: refetchAll,
  }
}
