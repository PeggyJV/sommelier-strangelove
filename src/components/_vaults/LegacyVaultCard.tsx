import {
  Avatar,
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Tooltip,
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react"
import {
  useDepositModalStore,
  DepositModalType,
} from "data/hooks/useDepositModalStore"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { toEther } from "utils/formatCurrency"
import { useAccount, useSwitchChain } from "wagmi"
import { useRouter } from "next/router"
import ConnectGate from "components/wallet/ConnectGate"
import ChainSwitcherInline from "components/network/ChainSwitcherInline"
import ActionButton from "components/ui/ActionButton"
import { coerceNetValue, parseMoneyString } from "utils/money"
import { useWithdrawalsPaused } from "data/hooks/useWithdrawalsPaused"

type StrategyLike = {
  slug?: string
  logo?: string
  name?: string
  provider?: { title?: string } | string
  tvm?: { value?: number | string; formatted?: string }
  baseApySumRewards?: { value?: number | string; formatted?: string }
  config?: {
    chain?: { displayName?: string; id?: string; logoPath?: string }
  }
  status?: "active" | "paused" | "withdrawals-only"
  deprecated?: boolean
}

type UserStrategyDataView = Partial<{
  userStrategyData: Partial<{
    userData: Partial<{
      netValue: Partial<{ formatted: string }>
    }>
    strategyData: Partial<{
      tokenPrice: string
    }>
  }>
  userStakes: Partial<{
    totalBondedAmount: Partial<{ formatted: string }>
  }>
}>

export default function LegacyVaultCard({
  vault,
  enabled = true,
}: {
  vault?: StrategyLike
  enabled?: boolean
}) {
  const router = useRouter()
  const { setIsOpen } = useDepositModalStore()
  const providerText =
    typeof vault?.provider === "string"
      ? vault.provider
      : vault?.provider?.title || ""
  const netValueNum =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value as string)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFormatted = vault?.baseApySumRewards?.formatted ?? "–"
  const chainName = vault?.config?.chain?.displayName ?? "Ethereum"
  const chainLogo = vault?.config?.chain?.logoPath
  const _status: "active" | "paused" | "withdrawals-only" =
    vault?.status ?? (vault?.deprecated ? "paused" : "paused")
  const withdrawalsPaused = useWithdrawalsPaused(vault?.slug)

  // Wallet/chain/balance state
  const { isConnected, chain } = useAccount()
  const cellarConfig = vault?.slug
    ? cellarDataMap[vault.slug]?.config
    : undefined
  const { lpToken } = useUserBalance(
    cellarConfig as Parameters<typeof useUserBalance>[0],
    enabled
  )
  const { data: lpTokenData } = lpToken
  const { switchChainAsync } = useSwitchChain()
  const desiredChainId = cellarConfig?.chain?.wagmiId
  const needsSwitch = !!desiredChainId && chain?.id !== desiredChainId

  // User net value (manage page logic)
  const stratAddress = cellarConfig?.cellar?.address
  const stratChainId = cellarConfig?.chain?.id
  const { data: userStratData } = useUserStrategyData(
    stratAddress ?? "",
    stratChainId ?? "",
    enabled && !!stratAddress && !!stratChainId
  )

  // Use user's actual net value for withdrawal logic, not the display net value
  const userStratDataView = userStratData as UserStrategyDataView
  const userNetValue =
    userStratDataView?.userStrategyData?.userData?.netValue?.formatted
  const nv = coerceNetValue(userNetValue)
  const canWithdraw = Number.isFinite(nv) && nv > 0
  const lpTokenDisabled =
    !lpTokenData ||
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <=
      0
  const safeVal = (v?: string | number | null) =>
    v == null || v === "" || v === 0 || v === "0" ? "–" : v

  // Rewards tone
  const rewardsColor =
    typeof netValueNum === "number"
      ? netValueNum >= 0
        ? "neutral.100"
        : "red.300"
      : "neutral.400"

  const href = vault?.slug
    ? `/strategies/${vault.slug}/manage`
    : undefined

  // Disabled tooltip text
  let tooltipLabel: string | undefined
  if (!isConnected) tooltipLabel = "Connect your wallet first"
  else if (needsSwitch)
    tooltipLabel = `Switch to ${cellarConfig?.chain?.displayName}`
  else if (withdrawalsPaused)
    tooltipLabel = "Waiting for the live withdrawal check"
  else if (lpTokenDisabled) tooltipLabel = "No funds to withdraw"

  return (
    <Grid
      templateColumns={{
        base: "minmax(0,1fr) auto",
        md: "minmax(0,1fr) 150px 110px 96px",
      }}
      columnGap={{ base: 3, md: 4 }}
      alignItems="center"
      px={{ base: 4, md: 5 }}
      py={2}
      w="full"
      cursor={href ? "pointer" : "default"}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={href ? `Open ${vault?.name ?? "vault"}` : undefined}
      _hover={{ bg: "whiteAlpha.50" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "purple.base",
        outlineOffset: "-2px",
      }}
      transition="background-color .15s ease"
      onClick={() => {
        if (href) router.push(href)
      }}
      onKeyDown={(e) => {
        if (!href) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          router.push(href)
        }
      }}
    >
      {/* Vault */}
      <HStack spacing={2.5} minW={0}>
        <Avatar
          size="sm"
          name={vault?.name}
          src={vault?.logo || undefined}
          bg="purple.dark"
          color="purple.light"
          boxSize="28px"
          fontSize="xs"
          flexShrink={0}
        />
        <Box minW={0}>
          <Text
            fontWeight={600}
            fontSize="sm"
            lineHeight="1.2"
            noOfLines={1}
          >
            {vault?.name}
          </Text>
          <Text
            fontSize="xs"
            color="neutral.400"
            lineHeight="1.2"
            noOfLines={1}
          >
            {providerText}
            <Box as="span" display={{ base: "inline", md: "none" }}>
              {" · "}
              {chainName}
            </Box>
          </Text>
        </Box>
      </HStack>

      {/* Network */}
      <HStack
        spacing={2}
        minW={0}
        display={{ base: "none", md: "flex" }}
      >
        {chainLogo && (
          <Image
            src={chainLogo}
            alt=""
            boxSize="16px"
            rounded="full"
            flexShrink={0}
          />
        )}
        <Text fontSize="sm" color="neutral.300" noOfLines={1}>
          {chainName}
        </Text>
      </HStack>

      {/* Net Rewards */}
      <Text
        display={{ base: "none", md: "block" }}
        textAlign="right"
        fontSize="sm"
        fontWeight={600}
        color={rewardsColor}
      >
        {safeVal(netFormatted)}
      </Text>

      {/* Debug Info */}
      {process.env.NEXT_PUBLIC_DEBUG_SORT === "1" && (
        <div className="text-xs opacity-60">
          nv={coerceNetValue(userNetValue)} tvl=
          {parseMoneyString(vault?.tvm?.formatted)} connected=
          {String(Boolean(isConnected))}
        </div>
      )}

      {/* Action */}
      <Flex justify="flex-end" minW={0}>
        <ConnectGate
          fallbackLabel="Connect"
          compact
          fullWidth
          overrideChainId={cellarConfig?.chain?.id}
        >
          {needsSwitch ? (
            <Popover placement="bottom" isLazy>
              <PopoverTrigger>
                <ActionButton
                  variantStyle="primary"
                  size="sm"
                  h="34px"
                  fullWidth
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation()
                    }
                  }}
                >
                  Switch network
                </ActionButton>
              </PopoverTrigger>
              <PopoverContent
                p={2}
                borderWidth={1}
                borderColor="purple.dark"
                borderRadius={12}
                bg="surface.bg"
                _focus={{ outline: "unset", boxShadow: "unset" }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <PopoverBody>
                  <ChainSwitcherInline
                    requiredChainId={desiredChainId}
                    fullWidth
                    onSwitched={async () => {
                      // after successful switch, open withdraw flow
                      try {
                        await switchChainAsync?.({
                          chainId: desiredChainId!,
                        })
                      } catch {}
                      if (vault?.slug) {
                        setIsOpen({
                          id: vault.slug,
                          type: "withdraw" as DepositModalType,
                        })
                      }
                    }}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip
              label={tooltipLabel}
              isDisabled={!tooltipLabel}
              bg="surface.bg"
              color="neutral.300"
              placement="top"
            >
              <ActionButton
                variantStyle={
                  !canWithdraw || withdrawalsPaused || !vault?.slug
                    ? "ghost"
                    : "primary"
                }
                size="sm"
                h="34px"
                fullWidth
                isDisabled={
                  !canWithdraw || withdrawalsPaused || !vault?.slug
                }
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!vault?.slug) return
                  setIsOpen({
                    id: vault.slug,
                    type: "withdraw" as DepositModalType,
                  })
                }}
              >
                Withdraw
              </ActionButton>
            </Tooltip>
          )}
        </ConnectGate>
      </Flex>
    </Grid>
  )
}
