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
}

const initialStakeState = {
  loading: false,
  error: false,
  userStakes: [],
}

type StakerData = {
  loading: boolean
  rewardRate?: BigNumber
  potentialStakingApy?: number
}

const initialStakerState = {
  loading: false,
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

  // TODO get from CG
  const sommPrice = 0.285414

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
    try {
      userStakes = await aaveStakerContract.getUserStakes(
        account?.address
      )
      numStakes = userStakes.length
    } catch (e) {
      console.warn("failed to read userStakes", e)
      setUserStakeData((state) => ({
        ...state,
        loading: false,
        error: true,
      }))
    }

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
  }, [aaveStakerContract, account?.address])

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
      }))
    } catch (error) {
      // TODO
      console.log("oops", error)
    }
  }, [aaveStakerContract])

  useEffect(() => {
    if (!aaveStakerContract) return
    console.log("calling")
    fetchStakerData()
  }, [aaveStakerContract, fetchStakerData])

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
