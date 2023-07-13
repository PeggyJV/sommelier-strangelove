import { useMutation } from "@tanstack/react-query"
import { depositAndSwap as depositAndSwap_V0815 } from "data/actions/CELLAR_ROUTER_V0815/depositAndSwap"
import { depositAndSwap as depositAndSwap_V0816 } from "data/actions/CELLAR_ROUTER_V0816/depositAndSwap"
import { DepositAndSwapPayload } from "data/actions/types"
import { CellarRouterKey, ConfigProps } from "data/types"
import { useAccount, useProvider } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"
import { CellarRouterV0815, CellarRouterV0816 } from "src/abi/types"

export const useDepositAndSwap = (config: ConfigProps) => {
  const { cellarRouterSigner } = useCreateContracts(config)
  const { address } = useAccount()
  const provider = useProvider()
  const signer01 = cellarRouterSigner as CellarRouterV0815
  const signer02 = cellarRouterSigner as CellarRouterV0816

  const query = useMutation(async (props: DepositAndSwapPayload) => {
    try {
      if (!address) throw new Error("address is undefined")
      if (
        config.cellarRouter.key ===
        CellarRouterKey.CELLAR_ROUTER_V0815
      ) {
        return await depositAndSwap_V0815({
          senderAddress: address,
          cellarRouterSigner: signer01,
          provider,
          payload: props,
        })
      }
      if (
        config.cellarRouter.key ===
        CellarRouterKey.CELLAR_ROUTER_V0816
      ) {
        return await depositAndSwap_V0816({
          senderAddress: address,
          cellarRouterSigner: signer02,
          provider,
          payload: props,
        })
      }

      throw new Error("UNKNOWN CONTRACT")
    } catch (error) {
      throw error
    }
  })

  return query
}
