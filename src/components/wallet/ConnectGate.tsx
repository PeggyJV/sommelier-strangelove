import { ReactNode } from "react"
import { Box, VisuallyHidden } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"

type ConnectGateProps = {
  children: ReactNode
  fallbackLabel?: string
  fullWidth?: boolean
  overrideChainId?: string
}

export default function ConnectGate({
  children,
  fallbackLabel,
  fullWidth,
  overrideChainId,
}: ConnectGateProps) {
  const { isConnected } = useAccount()

  if (isConnected) return <>{children}</>

  return (
    <Box
      w={fullWidth ? "100%" : "auto"}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation()
        }
      }}
    >
      <VisuallyHidden aria-live="polite">
        Wallet not connected
      </VisuallyHidden>
      <ConnectButton
        overridechainid={overrideChainId}
        // Use default styled variant to match app header theme
        // size and width align with primary CTAs
        children={fallbackLabel || "Connect wallet to continue"}
        size="md"
        height="44px"
        minW="148px"
        w={fullWidth ? "100%" : undefined}
        variant="solid"
      />
    </Box>
  )
}
