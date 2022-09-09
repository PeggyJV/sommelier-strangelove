import { useQuery } from "@tanstack/react-query"
import {
  useAccount,
  useContract,
  useProvider,
  useSigner,
  useToken,
} from "wagmi"
import { useCellarShareBalance } from "../cellar/useCellarShareBalance"
import { calculateUserData } from "src/composite-data/actions/calculate/userData"
import { useCellarData } from "../cellar/useCellarData"
import { ContractInterface } from "ethers"
import { useStakerUserData } from "../staker/useStakerUserData"
import { useUserBalances } from "./useUserBalances"
import { useGetPositionQuery } from "generated/subgraph"
import { ConfigProps } from "data/cellarDataMap"

export const useOutputUserData = (config: ConfigProps) => {
  const [{ data: account }] = useAccount()

  const [{ data: signer }] = useSigner()
  const provider = useProvider()

  const stakerSigner = useContract({
    addressOrName: config.staker.address,
    contractInterface: config.staker.abi as ContractInterface,
    signerOrProvider: signer,
  })
  const stakerContract = useContract({
    addressOrName: config.staker.address,
    contractInterface: config.staker.abi as ContractInterface,
    signerOrProvider: provider,
  })
  const cellarContract = useContract({
    addressOrName: config.cellar.address,
    contractInterface: config.cellar.abi as ContractInterface,
    signerOrProvider: provider,
  })

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
    activeAsset: aAssetToken,
    lpToken,
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
