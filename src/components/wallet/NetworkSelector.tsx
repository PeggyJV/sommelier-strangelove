import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react"
import { useAccount, useSwitchChain } from "wagmi"
import {
  Chain,
  chainConfig,
  chainConfigMap,
} from "src/data/chainConfig"
import { useMemo } from "react"
import ChainButton from "components/_buttons/ChainButton"
import { useBrandedToast } from "hooks/chakra"

export type NetworkSelectorMode = "inline" | "header"

export default function NetworkSelector({
  mode = "inline",
  requiredChainId,
  onSwitched,
  fullWidth,
}: {
  mode?: NetworkSelectorMode
  requiredChainId?: number
  onSwitched?: (chainId: number) => void
  fullWidth?: boolean
}) {
  const { chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
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
      await switchChainAsync({ chainId: requiredChain.wagmiId })
      onSwitched?.(requiredChain.wagmiId)
    } catch (e: any) {
      // If chain not added in wallet, try wallet_addEthereumChain
      if (
        e?.code === 4902 &&
        typeof window !== "undefined" &&
        (window as any)?.ethereum
      ) {
        try {
          const rpcUrls = [
            (requiredChain as any).infuraRpcUrl,
            (requiredChain as any).alchemyRpcUrl,
            (requiredChain as any).quicknodeRpcUrl,
          ].filter(Boolean)
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + requiredChain.wagmiId.toString(16),
                chainName: requiredChain.displayName,
                rpcUrls: rpcUrls.length ? rpcUrls : undefined,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [
                  requiredChain.blockExplorer?.url,
                ].filter(Boolean),
              },
            ],
          })
          await switchChainAsync({ chainId: requiredChain.wagmiId })
          onSwitched?.(requiredChain.wagmiId)
          return
        } catch (addErr: any) {
          addToast({
            heading: "Add network failed",
            status: "error",
            body: (
              <Text>
                {addErr?.message ?? "Unable to add network"}
              </Text>
            ),
          })
        }
      }
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
          >
            {`Switch to ${requiredChain.displayName}`}
          </Button>
        )}
      <HStack>
        <ChainButton
          chain={currentChain ?? chainConfigMap.ethereum}
          onChainChange={() => {}}
        />
      </HStack>
      {caption && (
        <Text fontSize="xs" color="neutral.400">
          {caption}
        </Text>
      )}
    </Stack>
  )
}
