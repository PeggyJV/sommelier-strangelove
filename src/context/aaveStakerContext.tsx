import { useContext, createContext, ReactNode } from "react"
import {
  useContract,
  useAccount,
  useProvider,
  useSigner,
  useBalance,
} from "wagmi"
import { Balance } from "wagmi-core"
import { config } from "utils/config"
import { useEffect, useState, useCallback } from "react"
import { BigNumber } from "bignumber.js"
import { BigNumber as BigNumberE } from "ethers"
import { ethers } from "ethers"

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

type SharedState = {
  // stakerData: StakerData
  userStakeData: UserStakeData
  aaveStakerSigner?: any
  fetchUserStakes?: any
}

const AaveStakerContext = createContext<SharedState>({
  userStakeData: initialStakeState,
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

  return (
    <AaveStakerContext.Provider
      value={{
        userStakeData,
        fetchUserStakes,
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
