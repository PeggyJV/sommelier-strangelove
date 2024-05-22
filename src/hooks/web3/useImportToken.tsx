import { useMutation } from "@tanstack/react-query"
import { cellarDataMap } from "data/cellarDataMap"
import { MutationEventArgs } from "types/hooks"
import { readContracts } from "@wagmi/core"
import { Address, erc20Abi, getAddress } from "viem"
import { chainConfigMap } from "data/chainConfig"
import { wagmiConfig } from "context/wagmiContext"

type Args = {
  address: string
  imageUrl?: string
  chain: string
}

type UseImportTokenArgs = MutationEventArgs<
  Args,
  Awaited<ReturnType<typeof readContracts>>
>

type DoImportToken = (
  args: Args
) => Promise<Awaited<ReturnType<typeof readContracts>>>

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



    const tokenData = await readContracts(wagmiConfig, {
      allowFailure: false,
      contracts: [
        {
          address: getAddress(address),
          abi: erc20Abi,
          functionName: 'decimals',
        },
        {
          address: getAddress(address),
          abi: erc20Abi,
          functionName: 'name',
        },
        {
          address: getAddress(address),
          abi: erc20Abi,
          functionName: 'symbol',
        },
        {
          address: getAddress(address),
          abi: erc20Abi,
          functionName: 'totalSupply',
        },
      ]
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
          symbol: tokenData[2],
          decimals: tokenData[0],
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
  return useMutation({
    mutationKey: ["USE_IMPORT_TOKEN"],
    mutationFn: doImportToken,
    onSuccess,
    onError,
    onMutate,
  })
}
