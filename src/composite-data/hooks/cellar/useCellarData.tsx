import { useQuery } from "@tanstack/react-query"
import { AaveV2CellarV2 } from "src/abi/types"
import { fetchCellarData } from "../../actions/cellar/AAVE_V2_STABLE_CELLAR/fetchCellarData"
import { ContractProps } from "../types"

export const useCellarData = ({
  cellar,
}: {
  cellar: Omit<ContractProps, "signer">
}) => {
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
