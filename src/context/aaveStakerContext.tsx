import { useContext, createContext, ReactNode } from "react"
import {
  useContract,
  useAccount,
  useProvider,
  useSigner,
} from "wagmi"
import { config } from "utils/config"
import { useEffect, useState, useCallback } from "react"
import { BigNumber } from "bignumber.js"
import { BigNumber as BigNumberE } from "ethers"
import { useCoingeckoPrice } from "hooks/web3/useCoingeckoPrice"

export interface UserStake {
  amount: BigNumberE
  amountWithBoost: BigNumberE
  rewardPerTokenPaid: BigNumberE
  rewards: BigNumberE
  unbondTimestamp: number
  lock: BigNumberE
  // maxDeposit?: BigNumberE
}

export interface UserStakeData {
  loading: boolean
  error: boolean
  totalRewards?: BigNumber
  totalBondedAmount?: BigNumber
  userStakes: UserStake[]
  totalClaimAllRewards?: BigNumber
  claimAllRewardsUSD?: BigNumber
}

const initialStakeState = {
  loading: false,
  error: false,
  userStakes: [],
}

type StakerData = {
  loading: boolean
  error: boolean
  rewardRate?: BigNumber
  potentialStakingApy?: number
  sommPrice?: number
}

const initialStakerState = {
  loading: false,
  error: false,
}

type SharedState = {
  stakerData: StakerData
  userStakeData: UserStakeData
  aaveStakerSigner?: any
  fetchUserStakes?: any
  fetchStakerData?: any
}

const AaveStakerContext = createContext<SharedState>({
  userStakeData: initialStakeState,
  stakerData: initialStakerState,
})

export const AaveStakerProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [{ data: signer }] = useSigner()
  const provider = useProvider()
  const [{ data: account }] = useAccount()
  const { CONTRACT } = config

  const sommPriceResponse = useCoingeckoPrice("sommelier")
  let sommPrice = 0
  if (sommPriceResponse) {
    sommPrice = parseFloat(sommPriceResponse)
  }

  const [userStakeData, setUserStakeData] =
    useState<UserStakeData>(initialStakeState)

  const [stakerData, setStakerData] = useState<StakerData>(
    initialStakerState
  )

  const aaveStakerSigner = useContract({
    addressOrName: CONTRACT.AAVE_STAKER.ADDRESS,
    contractInterface: CONTRACT.AAVE_STAKER.ABI,
    signerOrProvider: signer,
  })

  const aaveStakerContract = useContract({
    addressOrName: CONTRACT.AAVE_STAKER.ADDRESS,
    contractInterface: CONTRACT.AAVE_STAKER.ABI,
    signerOrProvider: provider,
  })

  const fetchUserStakes = useCallback(async () => {
    setUserStakeData((state) => ({ ...state, loading: true }))
    let numStakes
    let userStakes
    let claimAllRewards
    try {
      userStakes = await aaveStakerContract.getUserStakes(
        account?.address
      )
      numStakes = userStakes.length
      claimAllRewards = await aaveStakerSigner.callStatic.claimAll()
    } catch (e) {
      console.warn("failed to read userStakes", e)
      setUserStakeData((state) => ({
        ...state,
        loading: false,
        error: true,
      }))
    }

    let totalClaimAllRewards = new BigNumber(0)
    claimAllRewards?.length &&
      claimAllRewards.forEach((reward: any) => {
        totalClaimAllRewards = totalClaimAllRewards.plus(
          new BigNumber(reward.toString())
        )
      })

    try {
      let userStakesArray: UserStake[] = []
      let totalRewards = new BigNumber(0)
      let totalBondedAmount = new BigNumber(0)
      for (let i = 0; i < numStakes; i++) {
        const [
          amount,
          amountWithBoost,
          unbondTimestamp,
          rewardPerTokenPaid,
          rewards,
          lock,
        ] = userStakes[i]

        totalRewards = totalRewards.plus(
          new BigNumber(rewards?.toString())
        )

        totalBondedAmount = totalBondedAmount.plus(
          new BigNumber(amount?.toString())
        )

        userStakesArray.push({
          amount,
          amountWithBoost,
          rewardPerTokenPaid,
          rewards,
          unbondTimestamp,
          lock,
        })

        setUserStakeData((state) => ({
          ...state,
          loading: false,
          error: false,
          userStakes: userStakesArray,
          totalRewards: totalRewards,
          totalBondedAmount: totalBondedAmount,
          totalClaimAllRewards: totalClaimAllRewards,
          claimAllRewardsUSD: totalClaimAllRewards.multipliedBy(
            new BigNumber(sommPrice)
          ),
        }))
      }
    } catch (e) {
      console.warn("failed to read user stakes", e)
      setUserStakeData((state) => ({
        ...state,
        loading: false,
        error: true,
      }))
    }
  }, [
    aaveStakerContract,
    aaveStakerSigner.callStatic,
    account?.address,
  ])

  // user data
  useEffect(() => {
    if (!aaveStakerContract || !account?.address) return
    fetchUserStakes()
  }, [aaveStakerContract, account?.address, fetchUserStakes])

  const fetchStakerData = useCallback(async () => {
    setStakerData((state) => ({
      ...state,
      loading: true,
    }))

    try {
      // Somm rewards emitted per epoch
      let rewardRate = await aaveStakerContract.rewardRate()
      rewardRate = new BigNumber(rewardRate.toString())

      // Current deposits in the staker
      let totalDepositsWithBoost =
        await aaveStakerContract.totalDepositsWithBoost()
      totalDepositsWithBoost = new BigNumber(
        totalDepositsWithBoost.toString()
      )

      let currentEpochDuration =
        await aaveStakerContract.currentEpochDuration()
      currentEpochDuration = new BigNumber(
        currentEpochDuration.toString()
      )

      // Reward emissions per day
      const rewardPerEpoch = rewardRate
        .multipliedBy(currentEpochDuration)
        .dividedBy(new BigNumber(10 ** 6))
      const epochDays = currentEpochDuration.dividedBy(
        new BigNumber(60 * 60 * 24)
      )
      const dailyEmissions = rewardPerEpoch
        .dividedBy(epochDays)
        .toNumber()

      // Add potential deposit of $10,000 to totalDepositsWithBoost
      const potential = 10000
      const convertedTotalDeposits = totalDepositsWithBoost.div(
        new BigNumber(10).exponentiatedBy(18)
      )
      const potentialTotalDeposits =
        convertedTotalDeposits.toNumber() + potential

      // Daily rewards in USD
      const dailyEmissionsUSD = sommPrice * dailyEmissions
      const potentialRewardsUSD =
        (dailyEmissionsUSD * potential) / potentialTotalDeposits

      // APR & potential APY
      const apr = (potentialRewardsUSD / potential) * 100
      const potentialStakingApy = (1 + apr / 365) ** 365

      setStakerData((state) => ({
        ...state,
        loading: false,
        potentialStakingApy,
        sommPrice,
      }))
    } catch (error) {
      console.warn("Failed to calculate potential APY")
      setStakerData((state) => ({
        ...state,
        loading: false,
        error: true,
      }))
    }
  }, [aaveStakerContract, sommPrice])

  useEffect(() => {
    if (!aaveStakerContract && !sommPrice) return
    fetchStakerData()
  }, [aaveStakerContract, sommPrice, fetchStakerData])

  return (
    <AaveStakerContext.Provider
      value={{
        userStakeData,
        stakerData,
        fetchUserStakes,
        fetchStakerData,
        aaveStakerSigner,
      }}
    >
      {children}
    </AaveStakerContext.Provider>
  )
}

export const useAaveStaker = () => {
  return useContext(AaveStakerContext)
}
