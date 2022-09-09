import { useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { AaveV2CellarV2 } from "src/abi/types"
import { fetchCellarShareBalance } from "src/composite-data/actions/cellar/AAVE_V2_STABLE_CELLAR/fetchCellarShareBalance"
import { useAccount, useBalance } from "wagmi"
import { ContractProps } from "../types"

export const useCellarShareBalance = ({
  cellar,
  staker,
  totalBondedAmount,
  lpToken,
}: {
  staker: ContractProps
  cellar: Omit<ContractProps, "signer">
  totalBondedAmount?: BigNumber
  lpToken?: ReturnType<typeof useBalance>[0]
}) => {
  const [{ data: account }] = useAccount()

  const queryCellarShareBalanceKey = [
    "CELLAR_SHARE_BALANCE",
    lpToken?.data?.formatted,
    totalBondedAmount,
    account?.address,
  ] as const

  const queryCellarShareBalance = useQuery(
    queryCellarShareBalanceKey,
    async ({
      queryKey: [, _aaveCellarBalance, _totalBondedAmount, _address],
    }) => {
      if (cellar.key === "AAVE_V2_STABLE_CELLAR") {
        return await fetchCellarShareBalance({
          contract: cellar.contract as AaveV2CellarV2,
          aaveClrBalance: _aaveCellarBalance,
          totalBondedAmount: _totalBondedAmount?.toString(),
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: Boolean(
        lpToken?.data?.formatted &&
          totalBondedAmount &&
          account?.address &&
          // @ts-ignore we need to make sure the provider is not null
          staker.contract.provider
      ),
    }
  )

  return {
    data: queryCellarShareBalance.data,
    error: queryCellarShareBalance.error,
    isFetching:
      queryCellarShareBalance.isFetching || lpToken?.loading,
    isLoading: queryCellarShareBalance.isLoading,
    isRefetching: queryCellarShareBalance.isRefetching,
    isSuccess: queryCellarShareBalance.isSuccess,
    refetch: queryCellarShareBalance.refetch,
    status: queryCellarShareBalance.status,
  }
}
