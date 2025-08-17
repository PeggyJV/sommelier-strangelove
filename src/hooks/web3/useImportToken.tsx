import { erc20Abi } from "viem"
import { usePublicClient } from "wagmi"
import { useQuery } from "@tanstack/react-query"

export const useImportToken = (tokenAddress: string) => {
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ["USE_IMPORT_TOKEN", tokenAddress],
    queryFn: async () => {
      const tokenData = await publicClient.multicall({
        contracts: [
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
          },
        ],
      })

      return {
        name: tokenData[0].result,
        symbol: tokenData[1].result,
        decimals: tokenData[2].result,
      }
    },
    enabled: Boolean(tokenAddress && publicClient),
  })
}
