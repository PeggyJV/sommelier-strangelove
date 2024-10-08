import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { ConfigProps } from "data/types"
import { ReactNode } from "react"
import { TransactionReceipt } from "viem/_types/types/transaction"

type Result =
  | {
      data: TransactionReceipt
      error: undefined
    }
  | {
      data: undefined
      error: Error
    }

type TxParams = {
  cellarConfig: ConfigProps
  hash: string
  toastBody?: {
    info?: ReactNode
    success?: ReactNode
    error?:ReactNode
    successWithParams?: (data: Result) => ReactNode
  }
  onSuccess?: () => void
  onError?: (error: Error) => void
}
export const useHandleTransaction = (): {
  doHandleTransaction: (T: TxParams) => Promise<void>
} => {
  const { addToast, update, close, closeAll } = useBrandedToast()

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const doHandleTransaction = async ({
    cellarConfig,
    hash,
    toastBody,
    onSuccess,
    onError,
  }: TxParams) => {
    const infoBody = toastBody?.info || <Text>In progress...</Text>
    const errorBody = toastBody?.error || <Text>Failed</Text>

    addToast({
      heading: "Transaction",
      status: "default",
      body: infoBody,
      isLoading: true,
      closeHandler: close,
      duration: null,
    })
    const waitForApproval = wait({ confirmations: 1, hash })
    const result = await waitForApproval

    if (result?.data?.transactionHash) {
      const successBody = toastBody?.success || (
        <>
          <Text>Successful</Text>
          <Link
            display="flex"
            alignItems="center"
            href={`${cellarConfig.chain.blockExplorer.url}/tx/${result?.data?.transactionHash}`}
            isExternal
          >
            <Text as="span">{`View on ${cellarConfig.chain.blockExplorer.name}`}</Text>
            <ExternalLinkIcon ml={2} />
          </Link>
        </>
      )
      if (!!toastBody?.successWithParams) {
        const tBody = toastBody.successWithParams(result)
        update({
          heading: "Transaction",
          body: tBody,
          status: "success",
          closeHandler: closeAll,
        })
      } else {
        update({
          heading: "Transaction",
          body: successBody,
          status: "success",
          closeHandler: closeAll,
        })
      }

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess()
      }
    }

    if (result?.error) {
      update({
        heading: "Transaction",
        body: errorBody,
        status: "error",
        closeHandler: closeAll,
      })

      if (onError && typeof onError === "function") {
        onError(result.error)
      }
    }
  }

  return { doHandleTransaction }
}
