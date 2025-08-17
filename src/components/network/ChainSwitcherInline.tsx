import { Stack, Text } from "@chakra-ui/react"
import NetworkSelector from "components/wallet/NetworkSelector"

export default function ChainSwitcherInline({
  requiredChainId,
  onSwitched,
  fullWidth,
}: {
  requiredChainId?: number
  onSwitched?: (chainId: number) => void
  fullWidth?: boolean
}) {
  return (
    <Stack spacing={3} w={fullWidth ? "100%" : "auto"}>
      <NetworkSelector
        mode="inline"
        requiredChainId={requiredChainId}
        onSwitched={onSwitched}
        fullWidth={fullWidth}
      />
    </Stack>
  )
}
