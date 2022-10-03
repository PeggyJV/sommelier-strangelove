import { Text } from "@chakra-ui/react"
import { useMutation, UseMutationResult } from "@tanstack/react-query"
import { depositAndSwap as depositAndSwap_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/depositAndSwap"
import { DepositAndSwapPayload } from "data/actions/types"
import { CellarKey, ConfigProps } from "data/types"
import { ContractTransaction } from "ethers"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, useProvider } from "wagmi"
import { useCreateContracts } from "./useCreateContracts"

export const useDepositAndSwap = (
  config: ConfigProps
):
  | UseMutationResult<
      ContractTransaction | undefined,
      unknown,
      DepositAndSwapPayload
    >
  | undefined => {
  const { addToast, closeAll } = useBrandedToast()
  const { cellarRouterSigner } = useCreateContracts(config)
  const { address } = useAccount()
  const provider = useProvider()

  const query_AAVE_V2_STABLE_CELLAR = useMutation(
    async (props: DepositAndSwapPayload) => {
      try {
        if (!address) throw new Error("address is undefined")
        return await depositAndSwap_AAVE_V2_STABLE_CELLAR({
          senderAddress: address,
          cellarRouterSigner,
          provider,
          payload: props,
        })
      } catch (error) {
        addToast({
          heading: "Cellar Deposit",
          body: <Text>{(error as Error).message}</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    }
  )

  if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
    return query_AAVE_V2_STABLE_CELLAR
  }
}
