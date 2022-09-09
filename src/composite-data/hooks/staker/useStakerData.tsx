import { useQuery } from "@tanstack/react-query"
import { SommStaking } from "src/abi/types"
import { fetchStakerData } from "src/composite-data/actions/staker/AAVE_STAKER/fetchStakerData"
import { ContractProps } from "../types"

interface UseStakerDataProps {
  staker: Omit<ContractProps, "signer">
}

export const useStakerData = ({ staker }: UseStakerDataProps) => {
  const queryStaker = useQuery(["USE_STAKER_DATA"], async () => {
    if (staker.key === "AAVE_STAKER") {
      return await fetchStakerData(staker.contract as SommStaking)
    }
    throw new Error("UNKNOWN CONTRACT")
  })

  return {
    data: queryStaker.data,
    error: queryStaker.error,
    isFetching: queryStaker.isFetching,
    isLoading: queryStaker.isLoading,
    isRefetching: queryStaker.isRefetching,
    isSuccess: queryStaker.isSuccess,
    refetch: queryStaker.refetch,
    status: queryStaker.status,
  }
}
