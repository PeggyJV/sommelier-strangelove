import React, { useMemo } from "react"
import { Button, Stack, Text, VisuallyHidden } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useBrandedToast } from "hooks/chakra"
import { chainConfig, Chain } from "data/chainConfig"
import { requestSwitchWithAdd } from "utils/wallet/chainUtils"

interface NetworkSelectorProps {
  requiredChainId?: number
  mode?: "inline" | "button"
  onSwitched?: (chainId: number) => void
  fullWidth?: boolean
}

export default function NetworkSelector({
  requiredChainId,
  mode = "button",
  onSwitched,
  fullWidth = false,
}: NetworkSelectorProps) {
  const { chain } = useAccount()
  const { addToast } = useBrandedToast()

  const currentChain: Chain | undefined = useMemo(() => {
    if (!chain?.id) return undefined
    return chainConfig.find((c) => c.wagmiId === chain.id)
  }, [chain?.id])

  const requiredChain: Chain | undefined = useMemo(() => {
    if (!requiredChainId) return undefined
    return chainConfig.find((c) => c.wagmiId === requiredChainId)
  }, [requiredChainId])

  const handleQuickSwitch = async () => {
    if (!requiredChain) return
    try {
      await requestSwitchWithAdd(requiredChain.wagmiId as 1 | 42161 | 8453)
      onSwitched?.(requiredChain.wagmiId)
    } catch (e: any) {
      addToast({
        heading: "Network switch failed",
        status: "error",
        body: <Text>{e?.message ?? "Unable to switch network"}</Text>,
      })
    }
  }

  const caption =
    currentChain && requiredChain
      ? `You're on ${currentChain.displayName}. This vault runs on ${requiredChain.displayName}.`
      : undefined

  return (
    <Stack spacing={2} w={fullWidth ? "100%" : "auto"}>
      <VisuallyHidden aria-live="polite">
        Select or switch network
      </VisuallyHidden>
      {requiredChain &&
        currentChain?.wagmiId !== requiredChain.wagmiId && (
          <Button
            onClick={handleQuickSwitch}
            size={mode === "inline" ? "lg" : "md"}
            w={fullWidth ? "100%" : undefined}
            height={"44px"}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
            }}
            aria-describedby={
              caption ? "network-switch-caption" : undefined
            }
          >
            {`Switch to ${requiredChain.displayName}`}
          </Button>
        )}
      {caption && (
        <Text
          id="network-switch-caption"
          fontSize="sm"
          color="gray.500"
          textAlign="center"
        >
          {caption}
        </Text>
      )}
    </Stack>
  )
}
