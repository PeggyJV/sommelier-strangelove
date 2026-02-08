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
import { useUserBalance } from "data/hooks/useUserBalance"
import { isBefore } from "date-fns"
import { toEther } from "utils/formatCurrency"
import { useAccount } from "wagmi"
import { BaseButton } from "./BaseButton"
import { SecondaryButton } from "./SecondaryButton"
import { useState } from "react"
import { coerceNetValue, parseMoneyString } from "utils/money"

type DepositAndWithdrawRowOriginal = {
  slug?: string
  deprecated?: boolean
  isContractNotReady?: boolean
  launchDate?: string | number
  name?: string
  tvm?: { value?: string | number | null }
  netValue?: string | number | null
  userStrategyData?: {
    userData?: { netValue?: string | number | null }
  }
}

type DepositAndWithdrawButtonProps = {
  row: unknown
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

const checkHasValueInVault = (
  _lpTokenData: LPDataType | undefined,
  netValue: string | number | null | undefined
) => {
  // For main page: Only enable withdrawal if Net Value > 0
  const nv = coerceNetValue(netValue)
  const hasNetValue = Number.isFinite(nv) && nv > 0

  // On main page, we only care about net value for withdrawal buttons
  return hasNetValue
}

const checkIsBeforeLaunch = (
  launchDate: string | number | undefined
) => {
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

  const res = isDeprecated
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
  cellarConfig:
    | (typeof cellarDataMap)[string]["config"]
    | undefined,
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
  cellarConfig:
    | (typeof cellarDataMap)[string]["config"]
    | undefined,
  id: string,
  isDeprecated: boolean
): "withdraw" | "deposit" | "migrate" => {
  // Legacy vaults should never show deposit buttons
  if (isDeprecated) {
    return "withdraw"
  }
  if (!cellarConfig) {
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
  const rowOriginal = (
    row as { original?: DepositAndWithdrawRowOriginal }
  )?.original
  const id = rowOriginal?.slug
  const cellarConfig = id ? cellarDataMap[id]?.config : undefined
  const { lpToken } = useUserBalance(
    cellarConfig as Parameters<typeof useUserBalance>[0]
  )
  const { data: lpTokenData } = lpToken

  // Get net value from row data (main page data structure)
  // The main page data doesn't include userStrategyData, so we need to check differently
  const netValue =
    rowOriginal?.netValue ||
    rowOriginal?.userStrategyData?.userData?.netValue

  const lpTokenDisabled = checkLPtokenDisabled(lpTokenData)
  const hasValueInVault = checkHasValueInVault(lpTokenData, netValue)

  const { isConnected, chain } = useAccount()
  const isBeforeLaunch = checkIsBeforeLaunch(
    rowOriginal?.launchDate
  )
  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const closeOracleModal = () => setOracleModalOpen(false)

  const buttonText = getButtonText(
    Boolean(rowOriginal?.deprecated),
    lpTokenDisabled,
    cellarConfig,
    id ?? ""
  )

  const isWithdrawButton = buttonText === "Withdraw"

  // Debug logging for withdrawal button logic
  if (
    process.env.NEXT_PUBLIC_DEBUG_SORT === "1" &&
    rowOriginal?.name?.includes("Real Yield ETH")
  ) {
    console.log("Withdrawal button debug:", {
      name: rowOriginal?.name,
      netValue: netValue,
      coerceNetValue: coerceNetValue(netValue),
      hasValueInVault: hasValueInVault,
      isDeprecated: rowOriginal?.deprecated,
      buttonText: buttonText,
      isWithdrawButton: buttonText === "Withdraw",
    })
  }

  return (
    <>
      {/* Debug Info */}
      {process.env.NEXT_PUBLIC_DEBUG_SORT === "1" && (
        <div className="text-xs opacity-60">
          nv={coerceNetValue(netValue)} tvl=
          {parseMoneyString(rowOriginal?.tvm?.value)} connected=
          {String(Boolean(isConnected))}
        </div>
      )}

      <Tooltip
        bg="surface.bg"
        color="neutral.300"
        label={
          rowOriginal?.deprecated
            ? "Vault Deprecated"
            : "Connect your wallet first"
        }
        shouldWrapChildren
        display={checkDisplay(
          Boolean(rowOriginal?.deprecated),
          lpTokenDisabled,
          isConnected,
          isBeforeLaunch
        )}
      >
        {isWithdrawButton ? (
          <SecondaryButton
            disabled={checkButtonDisabled(
              rowOriginal?.isContractNotReady,
              Boolean(rowOriginal?.deprecated),
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
              if (
                cellarConfig &&
                chain?.id !== cellarConfig?.chain?.wagmiId
              ) {
                // Continue to manage page where user can switch
                window.location.href = `/strategies/${id}/manage`
                return
              }
              //! if share price oracle updating..
              //if (row.original.slug === "Turbo-SOMM") {
              //  openOracleModal()
              //  return
              //}

              if (rowOriginal?.deprecated && rowOriginal?.slug) {
                onDepositModalOpen({
                  id: rowOriginal.slug,
                  type: "withdraw",
                })
                return
              }
              if (!rowOriginal?.slug) return
              onDepositModalOpen({
                id: rowOriginal.slug,
                type: getButtonType(
                  cellarConfig,
                  id ?? "",
                  Boolean(rowOriginal?.deprecated)
                  ),
                })
            }}
            data-testid="withdraw-btn"
          >
            {buttonText}
          </SecondaryButton>
        ) : (
          <BaseButton
            disabled={checkButtonDisabled(
              rowOriginal?.isContractNotReady,
              Boolean(rowOriginal?.deprecated),
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
              if (
                cellarConfig &&
                chain?.id !== cellarConfig?.chain?.wagmiId
              ) {
                // Continue to manage page where user can switch
                window.location.href = `/strategies/${id}/manage`
                return
              }
              //! if share price oracle updating..
              //if (row.original.slug === "Turbo-SOMM") {
              //  openOracleModal()
              //  return
              //}

              if (rowOriginal?.deprecated && rowOriginal?.slug) {
                onDepositModalOpen({
                  id: rowOriginal.slug,
                  type: "withdraw",
                })
                return
              }
              if (!rowOriginal?.slug) return
              onDepositModalOpen({
                id: rowOriginal.slug,
                type: getButtonType(
                  cellarConfig,
                  id ?? "",
                  Boolean(rowOriginal?.deprecated)
                  ),
                })
            }}
            data-testid="deposit-btn"
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
