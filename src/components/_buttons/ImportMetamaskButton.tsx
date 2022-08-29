import { Tooltip, IconButton, Image } from "@chakra-ui/react"
import { useImportToken } from "hooks/web3/useImportToken"

export const ImportMetamaskButton = ({
  address,
}: {
  address: string
}) => {
  const { doImportToken, loading } = useImportToken(address)
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
        isLoading={loading}
        disabled={loading}
        onClick={doImportToken}
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
      />
    </Tooltip>
  )
}
