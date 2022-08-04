import { useContext, createContext, ReactNode } from "react"
import {
  useContract,
  useAccount,
  useProvider,
  useSigner,
  useBalance,
  useToken,
} from "wagmi"
import { config } from "utils/config"
import { useEffect, useState, useCallback } from "react"
import { BigNumber as BigNumberE } from "ethers"
import BigNumber from "bignumber.js"

type CellarState = {
  loading: boolean
  name: string
  activeAsset: string
  totalAssets?: BigNumber
  maxLocked?: BigNumber
  accrualPeriod?: BigNumber
  apy?: BigNumber
}

type Balances = {
  dai?: string
  aAsset?: any
  aaveClr?: string
}

type UserState = {
  loading: boolean
  balances?: Balances
  maxDeposit?: BigNumberE
  maxWithdraw?: BigNumberE
  netValue?: BigNumberE
}

const initialUserData: UserState = {
  loading: false,
}

type SharedState = {
  cellarData: CellarState
  userData: UserState
  aaveCellarSigner?: any
  aaveV2CellarContract?: any
  cellarRouterSigner?: any
  fetchUserData?: any
}

const initialCellarData: CellarState = {
  loading: false,
  name: "",
  activeAsset: "",
}
const AaveV2CellarContext = createContext<SharedState>({
  cellarData: initialCellarData,
  userData: initialUserData,
})

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const AaveV2CellarProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [{ data: signer }] = useSigner()
  const provider = useProvider()
  const [{ data: account }] = useAccount()
  const { CONTRACT } = config
  const [cellarData, setCellarData] = useState(initialCellarData)
  const [userData, setUserData] = useState(initialUserData)
  const aAsset = cellarData?.activeAsset
  const [{ data: aAssetToken }, getToken] = useToken({
    address: aAsset,
  })

  const [
    {
      data: aAssetBalance,
      error: aAssetError,
      loading: aAssetLoading,
    },
    getBalance,
  ] = useBalance({
    addressOrName: account?.address,
    token: aAsset,
    formatUnits: "wei",
  })

  const [
    {
      data: aaveClrBalance,
      error: aaveClrError,
      loading: aaveClrLoading,
    },
    refetch,
  ] = useBalance({
    addressOrName: account?.address,
    token: CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
    formatUnits: "wei",
  })

  const aaveCellarSigner = useContract({
    addressOrName: CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
    contractInterface: CONTRACT.AAVE_V2_STABLE_CELLAR.ABI,
    signerOrProvider: signer,
  })

  const cellarRouterSigner = useContract({
    addressOrName: CONTRACT.CELLAR_ROUTER.ADDRESS,
    contractInterface: CONTRACT.CELLAR_ROUTER.ABI,
    signerOrProvider: signer,
  })

  const aaveV2CellarContract = useContract({
    addressOrName: CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
    contractInterface: CONTRACT.AAVE_V2_STABLE_CELLAR.ABI,
    signerOrProvider: provider,
  })

  // cellar data
  useEffect(() => {
    if (!aaveV2CellarContract) return
    const fn = async () => {
      setCellarData((state) => ({ ...state, loading: true }))
      try {
        const name = await aaveV2CellarContract.name()
        const activeAsset = await aaveV2CellarContract.asset()

        // APY
        const maxLocked = new BigNumber(
          (await aaveV2CellarContract.maxLocked()).toString()
        )
        const totalAssets = new BigNumber(
          (await aaveV2CellarContract.totalAssets()).toString()
        )
        const accrualPeriod = new BigNumber(
          (await aaveV2CellarContract.accrualPeriod()).toString()
        )
        const accrualPeriodsInYear =
          yearInSecsBN.dividedBy(accrualPeriod)
        const apy = maxLocked
          .dividedBy(totalAssets)
          .multipliedBy(accrualPeriodsInYear)
          .multipliedBy(100)

        setCellarData((state) => ({
          ...state,
          name: name,
          activeAsset,
          aAssetToken,
          totalAssets: new BigNumber(totalAssets.toString()),
          maxLocked: new BigNumber(maxLocked.toString()),
          accrualPeriod,
          apy,
          loading: false,
        }))
      } catch (e) {
        console.warn("Cannot read cellar data", e)
        setCellarData((state) => ({ ...state, loading: false }))
      }
    }

    void fn()
  }, [aaveV2CellarContract])

  const fetchUserData = useCallback(async () => {
    setUserData((state) => ({ ...state, loading: true }))
    try {
      const userBalance = await aaveV2CellarContract.balanceOf(
        account?.address
      )
      const aaveClrBalance = await refetch()
      const netValue = userBalance.toString()

      const maxDeposit = await aaveV2CellarContract.maxDeposit(
        account?.address
      )

      const maxWithdraw = await aaveV2CellarContract.maxWithdraw(
        account?.address
      )

      setUserData((state) => ({
        ...state,
        balances: {
          ...state.balances,
          aAsset: aAssetBalance,
          aaveClr: aaveClrBalance?.data?.formatted,
        },
        maxDeposit: maxDeposit,
        maxWithdraw: maxWithdraw,
        netValue: netValue,
        loading: false,
      }))
    } catch (e) {
      console.warn("Cannot read user data", e)
      setUserData((state) => ({ ...state, loading: false }))
    }
  }, [aaveV2CellarContract, account?.address, aAssetBalance, refetch])

  // user data
  useEffect(() => {
    if (!aaveV2CellarContract || !account?.address) return
    fetchUserData()
  }, [aaveV2CellarContract, account?.address, fetchUserData])

  return (
    <AaveV2CellarContext.Provider
      value={{
        cellarData,
        userData,
        aaveCellarSigner,
        aaveV2CellarContract,
        cellarRouterSigner,
        fetchUserData,
      }}
    >
      {children}
    </AaveV2CellarContext.Provider>
  )
}

export const useAaveV2Cellar = () => {
  return useContext(AaveV2CellarContext)
}
