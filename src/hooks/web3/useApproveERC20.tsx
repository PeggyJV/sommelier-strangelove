import { useAccount, useWalletClient } from "wagmi"
import {
  Address,
  erc20Abi,
  getAddress,
  getContract,
  parseUnits,
  PublicClient,
} from "viem"
import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { useEffect, useState } from "react"
import { getActiveProvider } from "context/rpc_context"
import { chainConfigMap } from "data/chainConfig"

export const useApproveERC20 = ({
  tokenAddress,
  spender,
}: {
  tokenAddress: string
  spender: string
}) => {
  const { addToast, update, close, closeAll } = useBrandedToast()

  const { address, chain } = useAccount()

  const { data: walletClient } = useWalletClient()
  // Get paid RPC client
  const [paidClient, setPaidClient] = useState<PublicClient | null>(
    null
  )

  useEffect(() => {
    const initializePaidClient = async () => {
      if (chain?.id) {
        const chainConfigData = Object.values(chainConfigMap).find(
          (c) => c.wagmiId === chain.id
        )
        if (chainConfigData) {
          const client = await getActiveProvider(chainConfigData)
          setPaidClient(client)
        }
      }
    }
    initializePaidClient()
  }, [chain?.id])

  const erc20Contract =
    paidClient &&
    getContract({
      address: getAddress(tokenAddress),
      abi: erc20Abi,
      client: {
        wallet: walletClient,
        public: paidClient,
      },
    })!

  const [, wait] = useWaitForTransaction({
    skip: true,
  })

  const doApprove = async (
    amount: number,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) => {
    const allowance =
      (await erc20Contract?.read.allowance([
        address as Address,
        spender as Address,
      ])) ?? BigInt(0)
    const amtInWei = parseUnits(amount.toString(), 18)

    let needsApproval
    try {
      needsApproval = allowance < amtInWei
    } catch (e) {
      return
    }
    if (needsApproval) {
      try {
        // @ts-ignore
        const hash = await erc20Contract?.write.approve(
          [spender, amtInWei],
          { account: address }
        )

        addToast({
          heading: "ERC20 Approval",
          status: "default",
          body: <Text>Approving ERC20</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })

        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        if (result?.data?.transactionHash) {
          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })

          if (
            options?.onSuccess &&
            typeof options.onSuccess === "function"
          ) {
            options.onSuccess()
          }
        }

        if (result?.error) {
          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })

          if (
            options?.onError &&
            typeof options?.onError === "function"
          ) {
            options.onError(result.error)
          }
        }
      } catch (e) {
        const error = e as Error
        console.error(error)
        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "info",
          closeHandler: closeAll,
        })
        throw e
      }
    }
  }

  return { doApprove }
}
