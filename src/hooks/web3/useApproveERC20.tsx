import { useSigner, useContract, erc20ABI, useAccount } from "wagmi"
import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"

export const useApproveERC20 = ({
  tokenAddress,
  spender,
}: {
  tokenAddress: string
  spender: string
}) => {
  const { addToast, update, close, closeAll } = useBrandedToast()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const erc20Contract = useContract({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

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
    const allowance = await erc20Contract.allowance(address, spender)
    const amtInBigNumber = new BigNumber(amount)
    const amtInWei = ethers.utils.parseUnits(
      amtInBigNumber.toFixed(),
      18
    )

    let needsApproval
    try {
      needsApproval = allowance.lt(amtInWei)
    } catch (e) {
      return
    }
    if (needsApproval) {
      try {
        const { hash } = await erc20Contract.approve(
          spender,
          ethers.constants.MaxUint256
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
