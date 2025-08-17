import { erc20Abi } from "viem"
import { usePublicClient } from "wagmi"
import { useMutation } from "@tanstack/react-query"

interface ImportTokenParams {
  address: string
  imageUrl?: string
  chain?: string
}

interface ImportTokenCallbacks {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export const useImportToken = (callbacks?: ImportTokenCallbacks) => {
  const publicClient = usePublicClient()

  return useMutation({
    mutationFn: async (params: ImportTokenParams) => {
      // Get token data
      const tokenData = await publicClient.multicall({
        contracts: [
          {
            address: params.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          },
          {
            address: params.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          },
          {
            address: params.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
          },
        ],
      })

      const tokenInfo = {
        name: tokenData[0].result,
        symbol: tokenData[1].result,
        decimals: tokenData[2].result,
        address: params.address,
        imageUrl: params.imageUrl,
      }

      // Try to import to wallet (MetaMask)
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          console.log("Attempting to import token to MetaMask:", {
            address: params.address,
            symbol: tokenData[1].result,
            decimals: tokenData[2].result,
            image: params.imageUrl,
          })
          
          await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: params.address,
                symbol: tokenData[1].result,
                decimals: tokenData[2].result,
                image: params.imageUrl,
              },
            },
          })
          
          console.log("Token import to MetaMask successful")
        } catch (error) {
          console.error("Failed to import token to wallet:", error)
          throw error
        }
      } else {
        console.warn("MetaMask not available for token import")
      }

      return tokenInfo
    },
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
  })
}
