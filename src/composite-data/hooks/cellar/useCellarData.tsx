import { useQuery } from "@tanstack/react-query"
import { AaveV2CellarV2 } from "src/abi/types"
import { fetchCellarData } from "src/composite-data/actions/cellar/AAVE_V2_STABLE_CELLAR/fetchCellarData"
import { ContractProps } from "../types"

interface UseCellarDataProps {
  cellar: Omit<ContractProps, "signer">
}

export const useCellarData = ({ cellar }: UseCellarDataProps) => {
  const queryCellar = useQuery(["USE_CELLAR_DATA"], async () => {
    if (cellar.key === "AAVE_V2_STABLE_CELLAR") {
      return await fetchCellarData(cellar.contract as AaveV2CellarV2)
    }
    throw new Error("UNKNOWN CONTRACT")
  })

  return {
    data: queryCellar.data,
    error: queryCellar.error,
    isFetching: queryCellar.isFetching,
    isLoading: queryCellar.isLoading,
    isRefetching: queryCellar.isRefetching,
    isSuccess: queryCellar.isSuccess,
    refetch: queryCellar.refetch,
    status: queryCellar.status,
  }
}
