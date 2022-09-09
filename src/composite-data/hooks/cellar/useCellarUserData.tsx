import { useQuery } from "@tanstack/react-query"
import { AaveV2CellarV2 } from "src/abi/types"
import { fetchCellarUserData } from "src/composite-data/actions/cellar/AAVE_V2_STABLE_CELLAR/fetchCellarUserData"
import { useAccount } from "wagmi"
import { ContractProps } from "../types"

interface UseCellarUserDataProps {
  cellar: Omit<ContractProps, "signer">
}

export const useCellarUserData = ({
  cellar,
}: UseCellarUserDataProps) => {
  const [{ data }] = useAccount()
  const address = data?.address

  const queryUser = useQuery(
    ["USE_CELLAR_USER_DATA", address],
    async ({ queryKey: [, _address] }) => {
      if (cellar.key === "AAVE_V2_STABLE_CELLAR") {
        return await fetchCellarUserData(
          cellar.contract as AaveV2CellarV2,
          _address!
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    { enabled: Boolean(address) }
  )

  return {
    data: queryUser.data,
    error: queryUser.error,
    isFetching: queryUser.isFetching,
    isLoading: queryUser.isLoading,
    isRefetching: queryUser.isRefetching,
    isSuccess: queryUser.isSuccess,
    refetch: queryUser.refetch,
    status: queryUser.status,
  }
}
