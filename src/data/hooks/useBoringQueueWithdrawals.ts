import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query"
import { useAccount } from "wagmi"
import fetchUsersBoringQueueWithdrawals, {
  BoringQueueWithdrawals,
} from "queries/get-users-boringqueue-withdrawals"

export const useBoringQueueWithdrawals = (
  vaultAddress: string,
  chain: string,
  options?: Partial<UseQueryOptions<BoringQueueWithdrawals>>
): UseQueryResult<BoringQueueWithdrawals> => {
  const { address: userAddress } = useAccount()

  const query = useQuery<BoringQueueWithdrawals>({
    queryKey: [
      "USE_BORING_QUEUE_WITHDRAWALS",
      {
        contractAddress: vaultAddress,
        userAddress,
      },
    ],
    queryFn: async () => {
      return await fetchUsersBoringQueueWithdrawals(
        vaultAddress,
        userAddress as string,
        chain
      )
    },
    ...options,
  })
  return query
}
