import { Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { depositAndSwap as depositAndSwap_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/depositAndSwap"
import { depositAndSwap as depositAndSwap_CLEAR_GATE_CELLAR } from "data/actions/CLEAR_GATE_CELLAR/depositAndSwap"
import { DepositAndSwapPayload } from "data/actions/types"
import { CellarKey, ConfigProps } from "data/types"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, useProvider } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"

export const useDepositAndSwap = (config: ConfigProps) => {
  const { addToast, closeAll } = useBrandedToast()
  const { cellarRouterSigner } = useCreateContracts(config)
  const { address } = useAccount()
  const provider = useProvider()

  const query = useMutation(async (props: DepositAndSwapPayload) => {
    try {
      if (!address) throw new Error("address is undefined")
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await depositAndSwap_AAVE_V2_STABLE_CELLAR({
          senderAddress: address,
          cellarRouterSigner,
          provider,
          payload: props,
        })
      }
      if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) {
        return await depositAndSwap_CLEAR_GATE_CELLAR({
          senderAddress: address,
          cellarRouterSigner,
          provider,
          payload: props,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    } catch (error) {
      addToast({
        heading: "Cellar Deposit",
        body: <Text>{(error as Error).message}</Text>,
        status: "error",
        closeHandler: closeAll,
      })
    }
  })

  return query
}
