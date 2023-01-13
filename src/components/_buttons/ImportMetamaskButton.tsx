import { Tooltip, IconButton, Image, Text } from "@chakra-ui/react"
import { useBrandedToast } from "hooks/chakra"
import { useImportToken } from "hooks/web3/useImportToken"

export const ImportMetamaskButton = ({
  address,
}: {
  address: string
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to metamask</Text>,
        closeHandler: close,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: closeAll,
      })
    },
  })
  return (
    <Tooltip
      hasArrow
      arrowShadowColor="purple.base"
      label="Import token to metamask"
      color="neutral.300"
      placement="top"
      bg="surface.bg"
    >
      <IconButton
        isLoading={importToken.isLoading}
        disabled={importToken.isLoading}
        onClick={() => importToken.mutate({ address })}
        ml={1}
        aria-label="Import token to metamask"
        size="sm"
        icon={
          <Image
            src="/assets/images/metamask.png"
            alt="metamask icon"
            boxSize={5}
          />
        }
        variant="ghost"
      />
    </Tooltip>
  )
}
