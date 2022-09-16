import { useBrandedToast } from "hooks/chakra"
import { useState } from "react"
import { useToken } from "wagmi"
import { Text } from "@chakra-ui/react"

export const useImportToken = (address: string) => {
  const toast = useBrandedToast()

  const [isLoading, setLoading] = useState(false)
  const {
    data: tokenData,
    error,
    isLoading: tokenLoading,
  } = useToken({
    address,
  })

  const loading = tokenLoading || isLoading

  const doImportToken = async () => {
    try {
      if (error) {
        throw error
      }
      if (typeof window.ethereum === "undefined") {
        throw new Error("Metamask not installed")
      }
      if (!tokenData) {
        throw new Error("Token data is undefined")
      }
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: address,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
          },
        },
      })
      if (wasAdded) {
        toast.addToast({
          heading: "Import Token",
          status: "success",
          body: <Text>Token added to metamask</Text>,
          closeHandler: toast.closeAll,
        })
      }
      setLoading(false)
    } catch (e) {
      const error = e as Error
      toast.addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{error.message}</Text>,
        closeHandler: toast.closeAll,
      })
      setLoading(false)
    }
  }
  return {
    loading,
    doImportToken,
  }
}
