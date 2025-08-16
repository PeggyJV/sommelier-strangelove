import { Button } from "@chakra-ui/react"

export type VaultStatus = "active" | "paused" | "withdrawals-only"

export function VaultActionButton({
  vault,
}: {
  vault: { status?: VaultStatus }
}) {
  const status: VaultStatus = vault?.status ?? "active"
  const label =
    status === "withdrawals-only"
      ? "Enter Withdrawal"
      : status === "paused"
      ? "Paused"
      : "Deposit"

  return (
    <Button
      size="md"
      height="44px"
      minW="148px"
      isDisabled={status === "paused"}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </Button>
  )
}
