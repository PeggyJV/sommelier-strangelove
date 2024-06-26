import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { Address, erc20Abi, getAddress, getContract, parseUnits } from "viem"
import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"

export const useApproveERC20 = ({
  tokenAddress,
  spender,
}: {
  tokenAddress: string
  spender: string
}) => {
  const { addToast, update, close, closeAll } = useBrandedToast()

  const { address } = useAccount()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const erc20Contract = publicClient && getContract({
    address: getAddress(tokenAddress),
    abi: erc20Abi,
    client: {
      wallet: walletClient,
      public: publicClient
    },
  })!

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const doApprove = async (
    amount: number,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) => {
    const allowance = await erc20Contract?.read.allowance([
      address as Address,
      spender as Address
      ]
    ) ?? BigInt(0)
    const amtInWei = parseUnits(
      amount.toString(),
      18
    )

    let needsApproval
    try {
      needsApproval = allowance < amtInWei
    } catch (e) {
      return
    }
    if (needsApproval) {
      try {
        // @ts-ignore
        const hash = await erc20Contract?.write.approve([
          spender,
          amtInWei
          ],
          { account: address}
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
