import { ReactNode } from "react"
import { Box, VisuallyHidden } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"

type ConnectGateProps = {
  children: ReactNode
  fallbackLabel?: string
  fullWidth?: boolean
  overrideChainId?: string
  /** Smaller button for dense list rows */
  compact?: boolean
}

export default function ConnectGate({
  children,
  fallbackLabel,
  fullWidth,
  overrideChainId,
  compact,
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
        size={compact ? "sm" : "md"}
        height={compact ? "34px" : "44px"}
        minW={compact ? undefined : "148px"}
        minH={compact ? "34px" : undefined}
        px={compact ? 4 : undefined}
        fontSize={compact ? "sm" : undefined}
        w={fullWidth ? "100%" : undefined}
        variant={compact ? "outline" : "sommOutline"}
        {...(compact && {
          w: "100%",
          color: "neutral.200",
          fontWeight: 600,
          borderWidth: "1px",
          borderColor: "surface.quartnerary",
          rounded: "lg",
          bg: "transparent",
          _hover: { borderColor: "purple.base", color: "neutral.100" },
        })}
      >
        {fallbackLabel || "Connect wallet to continue"}
      </ConnectButton>
    </Box>
  )
}
