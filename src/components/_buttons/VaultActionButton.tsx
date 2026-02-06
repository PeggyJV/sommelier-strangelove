import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Heading,
  Stack,
} from "@chakra-ui/react"
import { useAccount, useSwitchChain } from "wagmi"
import ChainSwitcherInline from "components/network/ChainSwitcherInline"
import { BaseButton } from "./BaseButton"
import { SecondaryButton } from "./SecondaryButton"

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
      ? "Enter Withdrawal"
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
        <Popover
          placement="bottom"
          isLazy
          returnFocusOnClose
          initialFocusRef={undefined}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <BaseButton
              size="md"
              height="44px"
              minW="148px"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                }
              }}
            >
              Switch network
            </BaseButton>
          </PopoverTrigger>
          <PopoverContent
            p={3}
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
            bg="surface.bg"
            _focus={{ outline: "unset", boxShadow: "unset" }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
            }}
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
        <>
          {status === "withdrawals-only" ? (
            <SecondaryButton
              size="md"
              height="44px"
              minW="148px"
              isDisabled={false}
              onClick={(e) => {
                e.stopPropagation()
                vault?.onAction?.()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                }
              }}
            >
              {label}
            </SecondaryButton>
          ) : (
            <BaseButton
              size="md"
              height="44px"
              minW="148px"
              isDisabled={status === "paused"}
              onClick={(e) => {
                e.stopPropagation()
                vault?.onAction?.()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                }
              }}
            >
              {label}
            </BaseButton>
          )}
        </>
      )}
    </>
  )
}
