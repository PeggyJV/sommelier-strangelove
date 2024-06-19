import { useMutation } from "@tanstack/react-query"
import { depositAndSwap as depositAndSwap_V0815 } from "data/actions/CELLAR_ROUTER_V0815/depositAndSwap"
import { depositAndSwap as depositAndSwap_V0816 } from "data/actions/CELLAR_ROUTER_V0816/depositAndSwap"
import { DepositAndSwapPayload } from "data/actions/types"
import { CellarRouterKey, ConfigProps } from "data/types"
import { useAccount, usePublicClient } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"

export const useDepositAndSwap = (config: ConfigProps) => {
  const { cellarRouterSigner } = useCreateContracts(config)
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const signer = cellarRouterSigner

  const query = useMutation({
    mutationFn: async (props: DepositAndSwapPayload) => {
    try {
      if (!address) throw new Error("address is undefined")
      if (
        config.cellarRouter.key ===
        CellarRouterKey.CELLAR_ROUTER_V0815
      ) {
        return await depositAndSwap_V0815({
          senderAddress: address,
          cellarRouterSigner: signer,
          provider: publicClient,
          payload: props,
        })
      }
      if (
        config.cellarRouter.key ===
        CellarRouterKey.CELLAR_ROUTER_V0816
      ) {
        return await depositAndSwap_V0816({
          senderAddress: address,
          cellarRouterSigner: signer,
          provider: publicClient,
          payload: props,
        })
      }

      throw new Error("UNKNOWN CONTRACT")
    } catch (error) {
      throw error
    }
  }})

  return query
}
