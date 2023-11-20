import { Tooltip, Text} from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { useUserBalances } from "data/hooks/useUserBalances"
import { isBefore } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { useBrandedToast } from "hooks/chakra"
import { analytics } from "utils/analytics"
import { toEther } from "utils/formatCurrency"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import { BaseButton } from "./BaseButton"

type DepositAndWithdrawButtonProps = {
  row: any
  onDepositModalOpen: (arg: {
    id: string
    type: DepositModalType
  }) => void
}

type LPDataType = {
  formatted: string
  decimals: number
}

const checkLPtokenDisabled = (lpTokenData: LPDataType | undefined) =>
  !lpTokenData ||
  Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <= 0

const checkIsBeforeLaunch = (launchDate: string | undefined) => {
  const date = new Date(launchDate as string)
  return isBefore(date, new Date())
}

const checkDisplay = (
  isDeprecated: boolean,
  lpTokenDisabled: boolean,
  isConnected: boolean,
  isBeforeLaunch: boolean
) =>
  isDeprecated
    ? lpTokenDisabled || !isConnected || !isBeforeLaunch
      ? "inline"
      : "none"
    : !isConnected && !isDeprecated && lpTokenDisabled
    ? "inline"
    : "none"

const checkButtonDisabled = (
  isContractNotReady: boolean | undefined,
  isDeprecated: boolean,
  lpTokenDisabled: boolean,
  isConnected: boolean,
  isBeforeLaunch: boolean
) => {
  if (isContractNotReady !== undefined && isContractNotReady) {
    return true
  }

  var res = isDeprecated
    ? lpTokenDisabled
      ? true
      : false
    : false || !isConnected || !isBeforeLaunch

  return res
}

const getButtonText = (
  isDeprecated: boolean,
  lpTokenDisabled: boolean
) =>
  isDeprecated ? (lpTokenDisabled ? "Closed" : "Withdraw") : "Deposit"

export function DepositAndWithdrawButton({
  row,
  onDepositModalOpen,
}: DepositAndWithdrawButtonProps) {
  const id = row.original.slug
  const cellarConfig = cellarDataMap[id].config
  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData } = lpToken

  const lpTokenDisabled = checkLPtokenDisabled(lpTokenData)
  const { isConnected } = useAccount()
  const isBeforeLaunch = checkIsBeforeLaunch(
    row?.original?.launchDate
  )
  const { chain } = useNetwork()

  return (
    <Tooltip
      bg="surface.bg"
      color="neutral.300"
      label={
        row.original.deprecated
          ? "Vault Deprecated"
          : "Connect your wallet first"
      }
      shouldWrapChildren
      display={checkDisplay(
        row.original.deprecated,
        lpTokenDisabled,
        isConnected,
        isBeforeLaunch
      )}
    >
      <BaseButton
        disabled={checkButtonDisabled(
          row.original?.isContractNotReady,
          row.original.deprecated,
          lpTokenDisabled,
          isConnected,
          isBeforeLaunch
        )}
        variant="solid"
        onClick={async (e) => {
          e.stopPropagation()
          // analytics.track("home.deposit.modal-opened")

          // Check if user is on the right chain, if not prompt them to switch
          if (chain?.id !== cellarConfig.chain.wagmiId) {
            // Continue to manage page where user can switch
            window.location.href = `/strategies/${id}/manage`
            return
          }

          if (row.original.deprecated) {
            onDepositModalOpen({
              id: row.original.slug,
              type: "withdraw",
            })
            return
          }
          onDepositModalOpen({
            id: row.original.slug,
            type: "deposit",
          })
        }}
      >
        {getButtonText(row.original.deprecated, lpTokenDisabled)}
      </BaseButton>
    </Tooltip>
  )
}
