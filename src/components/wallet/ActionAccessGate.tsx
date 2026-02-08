import { ReactNode } from "react"
import { Box, VisuallyHidden } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import NetworkSelector from "components/wallet/NetworkSelector"
import ConnectButton from "components/_buttons/ConnectButton"

export default function ActionAccessGate({
  requiredChainId,
  children,
  fullWidth,
}: {
  requiredChainId: number
  children: ReactNode
  fullWidth?: boolean
}) {
  const { isConnected, chain } = useAccount()

  if (!isConnected) {
    return (
      <Box w={fullWidth ? "100%" : "auto"}>
        <VisuallyHidden aria-live="polite">
          Wallet not connected
        </VisuallyHidden>
        <ConnectButton
          size="lg"
          w={fullWidth ? "100%" : undefined}
        >
          Connect wallet to withdraw
        </ConnectButton>
      </Box>
    )
  }

  if (chain?.id !== requiredChainId) {
    return (
      <Box w={fullWidth ? "100%" : "auto"}>
        <VisuallyHidden aria-live="polite">
          Wrong network
        </VisuallyHidden>
        <NetworkSelector
          mode="inline"
          requiredChainId={requiredChainId}
          fullWidth={fullWidth}
        />
      </Box>
    )
  }

  return <>{children}</>
}
