import { useMutation } from "@tanstack/react-query"
import { fetchToken } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { MutationEventArgs } from "types/hooks"
import { getAddress } from "ethers/lib/utils.js"
import { Address } from "viem"
import { chainConfigMap } from "data/chainConfig"
type Args = {
  address: string
  imageUrl?: string
  chain: string
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
  chain,
}) => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("No wallet installed")
    }
    // Get chain from chainConfigMap
    const chainObj = chainConfigMap[chain]

    const tokenData = await fetchToken({
      address: getAddress(address),
      chainId: chainObj.wagmiId,
    })
    if (!tokenData) {
      throw new Error("Token data is undefined")
    }
    const imgUrl = Object.values(cellarDataMap).find(
      (item) =>
        item.config.lpToken.address === address &&
        item.config.chain.id === chainObj.id
    )?.config.lpToken.imagePath
    const fullImageUrl = `${window.origin}${imgUrl}`
    const res = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address as Address,
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
