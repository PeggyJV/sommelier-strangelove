import { useMutation } from "@tanstack/react-query"
import { fetchToken } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { MutationEventArgs } from "types/hooks"
type Args = {
  address: string
  imageUrl?: string
}

type UseImportTokenArgs = MutationEventArgs<
  Args,
  Awaited<ReturnType<typeof fetchToken>>
>

type DoImportToken = (
  args: Args
) => Promise<Awaited<ReturnType<typeof fetchToken>>>

export const doImportToken: DoImportToken = async ({
  address,
  imageUrl,
}) => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("No wallet installed")
    }
    const tokenData = await fetchToken({
      //@ts-ignore
      address,
    })
    if (!tokenData) {
      throw new Error("Token data is undefined")
    }
    const imgUrl = Object.values(cellarDataMap).find(
      (item) => item.config.lpToken.address === address
    )?.config.lpToken.imagePath
    const fullImageUrl = `${window.origin}${imgUrl}`
    const res = await window.ethereum.request({
      //@ts-ignore
      method: "wallet_watchAsset",
      params: {
        //@ts-ignore
        type: "ERC20",
        options: {
          address: address,
          symbol: tokenData.symbol,
          decimals: tokenData.decimals,
          image: imageUrl || fullImageUrl,
        },
      },
    })
    if (!res) {
      throw new Error("Failed to import token")
    }
    return tokenData
  } catch (e) {
    const error = e as Error
    throw error
  }
}
export const useImportToken = ({
  onSuccess,
  onError,
  onMutate,
}: UseImportTokenArgs = {}) => {
  const query = useMutation(["USE_IMPORT_TOKEN"], doImportToken, {
    onSuccess,
    onError,
    onMutate,
  })
  return query
}
