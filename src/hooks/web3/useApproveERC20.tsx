import {
  useSigner,
  useContract,
  erc20ABI,
  useAccount,
  useWaitForTransaction,
} from "wagmi"
import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"

export const useApproveERC20 = ({
  tokenAddress,
  spender,
}: {
  tokenAddress: string
  spender: string
}) => {
  const { addToast, update, close, closeAll } = useBrandedToast()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()

  const erc20Contract = useContract({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })
  // eslint-disable-next-line no-unused-vars
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const doApprove = async (amount: number) => {
    const allowance = await erc20Contract.allowance(
      account?.address,
      spender
    )
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
          body: <Text>Approving DAI</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })

        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        result?.data?.transactionHash &&
          update({
            heading: "ERC20 Approval",
            body: <Text>DAI Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })

        result?.error &&
          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
      } catch (e) {
        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "warning",
          closeHandler: closeAll,
        })
      }
    }
  }

  return { doApprove }
}
