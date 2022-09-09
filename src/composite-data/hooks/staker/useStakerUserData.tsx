import { useQuery } from "@tanstack/react-query"
import { SommStaking } from "src/abi/types"
import { fetchStakerUserData } from "src/composite-data/actions/staker/AAVE_STAKER/fetchStakerUserData"
import { useAccount } from "wagmi"
import { ContractProps } from "../types"

interface UseStakerUserDataProps {
  staker: ContractProps
}

export const useStakerUserData = ({
  staker,
}: UseStakerUserDataProps) => {
  const [{ data }] = useAccount()
  const address = data?.address

  const queryUser = useQuery(
    ["USE_STAKER_USER_DATA", address],
    async ({ queryKey: [, _address] }) => {
      if (staker.key === "AAVE_STAKER") {
        return await fetchStakerUserData(
          staker.contract as SommStaking,
          staker.signer as SommStaking,
          _address!
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: Boolean(
        address &&
          // @ts-ignore we need to make sure the provider is not null
          staker.contract.provider &&
          // @ts-ignore we need to make sure the provider is not null
          staker.signer.provider &&
          // @ts-ignore we need to make sure the signer is not null
          staker.signer.signer
      ),
    }
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
