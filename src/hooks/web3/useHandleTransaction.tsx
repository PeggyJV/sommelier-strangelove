import { useWaitForTransaction } from "wagmi"
import { Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"

type TxParams = {
  hash: string
  toastBody?: {
    info?: React.ReactNode
    success?: React.ReactNode
    error?: React.ReactNode
  }
  onSuccess?: () => void
  onError?: (error: Error) => void
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
            href={`https://etherscan.io/tx/${result?.data?.transactionHash}`}
            isExternal
          >
            <Text as="span">View on Etherscan</Text>
            <ExternalLinkIcon ml={2} />
          </Link>
        </>
      )
      update({
        heading: "Transaction",
        body: successBody,
        status: "success",
        closeHandler: closeAll,
      })

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
