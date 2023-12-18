import {
  Tooltip,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { useUserBalances } from "data/hooks/useUserBalances"
import { isBefore } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { analytics } from "utils/analytics"
import { toEther } from "utils/formatCurrency"
import { useAccount } from "wagmi"
import { BaseButton } from "./BaseButton"
import { useState } from "react"

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
  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const openOracleModal = () => setOracleModalOpen(true)
  const closeOracleModal = () => setOracleModalOpen(false)

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
        onClick={(e) => {
          e.stopPropagation()
          // analytics.track("home.deposit.modal-opened")

          //! Turbo Somm share price oracle updating..
          if (row.original.slug === "Turbo-SOMM") {
            openOracleModal()
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
      {isOracleModalOpen && (
        <Modal isOpen={isOracleModalOpen} onClose={closeOracleModal} isCentered>
          <ModalOverlay />
          <ModalContent
            p={2}
            w="auto"
            zIndex={401}
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
            bg="surface.bg"
            fontWeight="semibold"
            _focus={{
              outline: "unset",
              outlineOffset: "unset",
              boxShadow: "unset",
            }}
          >
            <ModalCloseButton />
            <ModalHeader textAlign="center">Notice!</ModalHeader>
            <ModalBody textAlign="center">
              <Text>
                Deposits and withdrawals have been temporarily
                disabled for Turbo SOMM while our oracle updates.
                Normal operations are set to resume on Dec 21st.
              </Text>
              <br />
              <Text>
                All user funds are safe. We appreciate your
                understanding.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Tooltip>
  )
}
