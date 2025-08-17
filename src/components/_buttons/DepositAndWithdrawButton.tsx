import {
  Tooltip,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { DepositModalType } from "data/hooks/useDepositModalStore"
import { useUserBalance } from "data/hooks/useUserBalance"
import { isBefore } from "date-fns"
import { toEther } from "utils/formatCurrency"
import { useAccount } from "wagmi"
import { BaseButton } from "./BaseButton"
import { SecondaryButton } from "./SecondaryButton"
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

import { coerceNetValue, parseMoneyString } from "utils/money"

const checkHasValueInVault = (
  lpTokenData: LPDataType | undefined,
  netValue: any
) => {
  // For main page: Only enable withdrawal if Net Value > 0
  const nv = coerceNetValue(netValue)
  const hasNetValue = Number.isFinite(nv) && nv > 0

  // For other pages: Check both LP tokens and net value
  const hasLPTokens =
    lpTokenData &&
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) > 0

  // On main page, we only care about net value for withdrawal buttons
  return hasNetValue
}

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
  hasValueInVault: boolean,
  isConnected: boolean,
  isBeforeLaunch: boolean,
  isWithdrawButton: boolean
) => {
  if (isContractNotReady !== undefined && isContractNotReady) {
    return true
  }

  var res = isDeprecated
    ? !hasValueInVault
      ? true
      : false
    : isWithdrawButton
    ? !hasValueInVault || !isConnected || !isBeforeLaunch
    : !isConnected || !isBeforeLaunch

  return res
}

const getButtonText = (
  isDeprecated: boolean,
  lpTokenDisabled: boolean,
  cellarConfig: any,
  id: string
) => {
  if (isDeprecated) {
    return lpTokenDisabled ? "Closed" : "Withdraw"
  }

  const buttonType = getButtonType(cellarConfig, id, isDeprecated)
  return buttonType === "deposit"
    ? "Deposit"
    : buttonType === "migrate"
    ? "Migrate"
    : "Withdraw"
}

const getButtonType = (
  cellarConfig: any,
  id: string,
  isDeprecated: boolean
): "withdraw" | "deposit" | "migrate" => {
  // Legacy vaults should never show deposit buttons
  if (isDeprecated) {
    return "withdraw"
  }

  const alphaStEth = cellarDataMap["Alpha-stETH"]
  const includesBaseAsset = alphaStEth.depositTokens.list.includes(
    cellarConfig.baseAsset.symbol
  )
  if (id === "Alpha-stETH") {
    return "deposit"
  }
  if (!includesBaseAsset || cellarConfig.chain.id !== "ethereum") {
    return "withdraw"
  }
  return "migrate"
}

export function DepositAndWithdrawButton({
  row,
  onDepositModalOpen,
}: DepositAndWithdrawButtonProps) {
  const id = row.original.slug
  const cellarConfig = cellarDataMap[id].config
  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData } = lpToken

  // Get net value from row data (main page data structure)
  // The main page data doesn't include userStrategyData, so we need to check differently
  const netValue =
    row.original?.netValue ||
    row.original?.userStrategyData?.userData?.netValue

  const lpTokenDisabled = checkLPtokenDisabled(lpTokenData)
  const hasValueInVault = checkHasValueInVault(lpTokenData, netValue)

  // Debug logging for withdrawal button logic
  if (
    process.env.NEXT_PUBLIC_DEBUG_SORT === "1" &&
    row.original?.name?.includes("Real Yield ETH")
  ) {
    console.log("Withdrawal button debug:", {
      name: row.original?.name,
      netValue: netValue,
      coerceNetValue: coerceNetValue(netValue),
      hasValueInVault: hasValueInVault,
      isDeprecated: row.original?.deprecated,
      buttonText: buttonText,
      isWithdrawButton:
        buttonText === "Withdraw" || buttonText === "Withdraw Only",
    })
  }

  const { isConnected, chain } = useAccount()
  const isBeforeLaunch = checkIsBeforeLaunch(
    row?.original?.launchDate
  )
  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const openOracleModal = () => setOracleModalOpen(true)
  const closeOracleModal = () => setOracleModalOpen(false)

  const buttonText = getButtonText(
    row.original.deprecated,
    lpTokenDisabled,
    cellarConfig,
    id
  )

  const isWithdrawButton =
    buttonText === "Withdraw" || buttonText === "Withdraw Only"

  return (
    <>
      {/* Debug Info */}
      {process.env.NEXT_PUBLIC_DEBUG_SORT === "1" && (
        <div className="text-xs opacity-60">
          nv={coerceNetValue(netValue)} tvl=
          {parseMoneyString(row.original?.tvm?.value)} connected=
          {String(Boolean(isConnected))}
        </div>
      )}

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
        {isWithdrawButton ? (
          <SecondaryButton
            disabled={checkButtonDisabled(
              row.original?.isContractNotReady,
              row.original.deprecated,
              lpTokenDisabled,
              hasValueInVault,
              isConnected,
              isBeforeLaunch,
              true // isWithdrawButton
            )}
            onClick={async (e) => {
              e.stopPropagation()
              // analytics.track("home.deposit.modal-opened")

              // Check if user is on the right chain, if not prompt them to switch
              if (chain?.id !== cellarConfig.chain.wagmiId) {
                // Continue to manage page where user can switch
                window.location.href = `/strategies/${id}/manage`
                return
              }
              //! if share price oracle updating..
              //if (row.original.slug === "Turbo-SOMM") {
              //  openOracleModal()
              //  return
              //}

              if (row.original.deprecated) {
                onDepositModalOpen({
                  id: row.original.slug,
                  type: "withdraw",
                })
                return
              }
              onDepositModalOpen({
                id: row.original.slug,
                type: getButtonType(
                  cellarConfig,
                  id,
                  row.original.deprecated
                ),
              })
            }}
          >
            {buttonText}
          </SecondaryButton>
        ) : (
          <BaseButton
            disabled={checkButtonDisabled(
              row.original?.isContractNotReady,
              row.original.deprecated,
              lpTokenDisabled,
              hasValueInVault,
              isConnected,
              isBeforeLaunch,
              false // isWithdrawButton (this is for deposit/migrate buttons)
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
              //! if share price oracle updating..
              //if (row.original.slug === "Turbo-SOMM") {
              //  openOracleModal()
              //  return
              //}

              if (row.original.deprecated) {
                onDepositModalOpen({
                  id: row.original.slug,
                  type: "withdraw",
                })
                return
              }
              onDepositModalOpen({
                id: row.original.slug,
                type: getButtonType(
                  cellarConfig,
                  id,
                  row.original.deprecated
                ),
              })
            }}
          >
            {buttonText}
          </BaseButton>
        )}
        {isOracleModalOpen && (
          <Modal
            isOpen={isOracleModalOpen}
            onClose={closeOracleModal}
            isCentered
          >
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
    </>
  )
}
