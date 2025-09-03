import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useAccount, useSwitchChain } from "wagmi"
import ChainSwitcherInline from "components/network/ChainSwitcherInline"

export type VaultStatus = "active" | "paused" | "withdrawals-only"

export function VaultActionButton({
  vault,
}: {
  vault: {
    status?: VaultStatus
    config?: { chain?: { wagmiId?: number; displayName?: string } }
    onAction?: () => void
  }
}) {
  const status: VaultStatus = vault?.status ?? "active"
  const label =
    status === "withdrawals-only"
      ? "Withdraw"
      : status === "paused"
      ? "Paused"
      : "Deposit"

  const { chain } = useAccount()
  const expectedChainId = vault?.config?.chain?.wagmiId
  const isWrongChain = Boolean(
    expectedChainId && chain?.id !== expectedChainId
  )
  const { switchChainAsync } = useSwitchChain()

  return (
    <>
      {isWrongChain && status !== "paused" ? (
        <Popover placement="bottom" isLazy>
          <PopoverTrigger>
            <Button
              size="md"
              height="44px"
              minW="148px"
              onClick={(e) => e.stopPropagation()}
            >
              Switch network
            </Button>
          </PopoverTrigger>
          <PopoverContent
            p={3}
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
            bg="surface.bg"
            _focus={{ outline: "unset", boxShadow: "unset" }}
          >
            <PopoverBody>
              <Stack spacing={2}>
                <Heading as="h3" size="sm">
                  Switch to {vault?.config?.chain?.displayName} to
                  continue
                </Heading>
                <ChainSwitcherInline
                  requiredChainId={expectedChainId}
                  fullWidth
                  onSwitched={async () => {
                    try {
                      await switchChainAsync?.({
                        chainId: expectedChainId!,
                      })
                      // auto-continue original action if provided
                      vault?.onAction?.()
                    } catch {
                      // swallow; upstream toast already handles failure
                    }
                  }}
                />
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          size="md"
          height="44px"
          minW="148px"
          isDisabled={status === "paused"}
          onClick={(e) => {
            e.stopPropagation()
            vault?.onAction?.()
          }}
        >
          {label}
        </Button>
      )}
    </>
  )
}
