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

type TxParams = {
  hash: string
  toastBody?: {
    info?: React.ReactNode
    success?: React.ReactNode
    error?: React.ReactNode
  }
}
export const useHandleTransaction = (): {
  doHandleTransaction: (T: TxParams) => Promise<void>
} => {
  const { addToast, update, close, closeAll } = useBrandedToast()
  // eslint-disable-next-line no-unused-vars
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const doHandleTransaction = async ({
    hash,
    toastBody,
  }: TxParams) => {
    const infoBody = toastBody?.info || <Text>In Progress...</Text>
    const successBody = toastBody?.info || <Text>Tx Successful</Text>
    const errorBody = toastBody?.info || <Text>Tx Failed</Text>

    addToast({
      heading: "ERC20 Approval",
      status: "default",
      body: infoBody,
      isLoading: true,
      closeHandler: close,
      duration: null,
    })
    const waitForApproval = wait({ confirmations: 1, hash })
    const result = await waitForApproval
    console.log({ result })
    result?.data?.transactionHash &&
      update({
        heading: "ERC20 Approval",
        body: successBody,
        status: "success",
        closeHandler: closeAll,
      })

    result?.error &&
      update({
        heading: "ERC20 Approval",
        body: errorBody,
        status: "error",
        closeHandler: closeAll,
      })
  }

  return { doHandleTransaction }
}
