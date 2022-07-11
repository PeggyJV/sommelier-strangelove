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
  rewardRate: BigNumber
  totalDepositsWithBoost: BigNumber
}

const initialStakerState = {
  loading: false,
  rewardRate: new BigNumber(0),
  totalDepositsWithBoost: new BigNumber(0),
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
    signerOrProvider: signer,
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
    console.log("HAS STAKER CONTRACT?", aaveStakerContract)
    // setStakerData((state) => ({
    //   ...state,
    //   loading: true,
    // }))

    try {
      // const rewardRate = await aaveStakerContract.rewardRate()
      // const totalDepositsWithBoost =
      //   await aaveStakerContract.totalDepositsWithBoost()
      // console.log("reward rate fetch", rewardRate)
      // const s = await aaveStakerContract.owner()
    } catch (error) {
      console.log(error)
    }

    // setStakerData((state) => ({
    //   ...state,
    //   loading: false,
    //   // rewardRate,
    //   totalDepositsWithBoost,
    // }))
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
