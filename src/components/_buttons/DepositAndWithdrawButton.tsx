import { Tooltip } from "@chakra-ui/react"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { isBefore } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { analytics } from "utils/analytics"
import { useAccount } from "wagmi"
import { BaseButton } from "./BaseButton"

type DepositAndWithdrawButtonProps = {
  row: any
  onDepositModalOpen: ({
    id,
    type,
  }: {
    id: string
    type: DepositModalType
  }) => void
}

export function DepositAndWithdrawButton({
  row,
  onDepositModalOpen,
}: DepositAndWithdrawButtonProps) {
  const { isConnected } = useAccount()

  const date = new Date(row?.original?.launchDate as Date)
  const dateTz = date && zonedTimeToUtc(date, "EST")
  const isBeforeLaunch = isBefore(dateTz, new Date())
  return (
    <Tooltip
      bg="surface.bg"
      color="neutral.300"
      label={
        row.original.deprecated
          ? "Strategy Deprecated"
          : "Connect your wallet first"
      }
      shouldWrapChildren
      display={
        row.original.deprecated || !isConnected || !isBeforeLaunch
          ? "inline"
          : "none"
      }
    >
      <BaseButton
        disabled={
          row.original.deprecated || !isConnected || !isBeforeLaunch
        }
        variant="solid"
        onClick={(e) => {
          e.stopPropagation()
          onDepositModalOpen({
            id: row.original.slug,
            type: "deposit",
          })
          analytics.track("home.deposit.modal-opened")
        }}
      >
        {row.original.deprecated ? "Closed" : "Deposit"}
      </BaseButton>
    </Tooltip>
  )
}
