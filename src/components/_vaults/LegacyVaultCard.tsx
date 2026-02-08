import {
  Avatar,
  Box,
  HStack,
  Image,
  Text,
  Tooltip,
  VStack,
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
  const tvl = vault?.tvm?.formatted ?? "–"
  const netValueNum =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value as string)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFormatted = vault?.baseApySumRewards?.formatted ?? "–"
  const chainName = vault?.config?.chain?.displayName ?? "Ethereum"
  const chainLogo = vault?.config?.chain?.logoPath
  const _status: "active" | "paused" | "withdrawals-only" =
    vault?.status ?? (vault?.deprecated ? "paused" : "paused")

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
  const userNetValueFmt =
    userStratDataView?.userStrategyData?.userData?.netValue
      ?.formatted

  // Combine free LP net value + bonded LP value for legacy vaults
  const bondedAmtStr =
    userStratDataView?.userStakes?.totalBondedAmount?.formatted
  const bondedAmt = bondedAmtStr ? parseFloat(bondedAmtStr) : 0
  const tokenPriceStr =
    userStratDataView?.userStrategyData?.strategyData?.tokenPrice ||
    "0"
  const tokenPrice = parseFloat(tokenPriceStr.replace("$", "")) || 0
  const bondedValue = bondedAmt * tokenPrice
  const combinedNetValue =
    (Number.isFinite(nv) ? nv : 0) + bondedValue
  const combinedNetValueFmt =
    combinedNetValue > 0
      ? `$${combinedNetValue
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
      : userNetValueFmt

  const safeVal = (v?: string | number | null) =>
    v == null || v === "" || v === 0 || v === "0" ? "–" : v

  // Rewards tone and arrow
  const rewardsArrow =
    typeof netValueNum === "number"
      ? netValueNum >= 0
        ? "↑"
        : "↓"
      : ""
  const rewardsColor =
    typeof netValueNum === "number"
      ? netValueNum >= 0
        ? "green.300"
        : "red.300"
      : "neutral.300"

  const href = vault?.slug
    ? `/strategies/${vault.slug}/manage`
    : undefined

  // Disabled tooltip text
  let tooltipLabel: string | undefined
  if (!isConnected) tooltipLabel = "Connect your wallet first"
  else if (needsSwitch)
    tooltipLabel = `Switch to ${cellarConfig?.chain?.displayName}`
  else if (lpTokenDisabled) tooltipLabel = "No funds to withdraw"

  return (
    <Box
      borderWidth="1px"
      borderColor="surface.secondary"
      bg="surface.primary"
      rounded="xl"
      p={{ base: 4, md: 5 }}
      w="full"
      overflow="hidden"
      cursor={href ? "pointer" : "default"}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={href ? `Open ${vault?.name ?? "vault"}` : undefined}
      _hover={{ bg: "surface.secondary", borderColor: "purple.base" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "purple.base",
        outlineOffset: "2px",
      }}
      transition="background-color .2s ease, border-color .2s ease, box-shadow .2s ease"
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
      {/* 3-column layout: identity | KPIs | action */}
      <Grid
        templateColumns={{ base: "1fr", md: "1.2fr 1.2fr 0.9fr" }}
        gap={{ base: 3, md: 6 }}
        alignItems="center"
        overflow="visible"
      >
        {/* Identity */}
        <HStack spacing={3} align="center" minW={0}>
          {vault?.logo && (
            <Image
              src={vault.logo}
              alt={vault.name || "Vault"}
              boxSize="44px"
              rounded="full"
            />
          )}
          <VStack spacing={1} align="flex-start" minW={0}>
            <Text
              fontWeight={800}
              fontSize={{ base: "lg", md: "xl" }}
              noOfLines={1}
            >
              {vault?.name}
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              <Text
                fontSize="sm"
                color="whiteAlpha.800"
                noOfLines={1}
              >
                {providerText}
              </Text>
              {chainLogo && (
                <HStack
                  spacing={1}
                  px={2}
                  py={0.5}
                  rounded="full"
                  bg="whiteAlpha.100"
                >
                  <Avatar
                    name={chainName}
                    src={chainLogo}
                    background="transparent"
                    border="none"
                    sx={{ width: "18px", height: "18px" }}
                  />
                  <Text fontSize="xs" color="whiteAlpha.800">
                    {chainName}
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </HStack>

        {/* KPIs */}
        <Grid
          templateColumns={{
            base: "repeat(3, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={{ base: 2, md: 4 }}
          alignItems="center"
        >
          <VStack spacing={1} align="flex-start" minW={0}>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight={800}
              lineHeight={1}
            >
              {safeVal(tvl)}
            </Text>
            <Text fontSize="xs" color="neutral.400">
              TVL
            </Text>
          </VStack>
          <VStack spacing={1} align="center" minW={0}>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight={800}
              lineHeight={1}
            >
              {safeVal(combinedNetValueFmt)}
            </Text>
            <Text fontSize="xs" color="neutral.400">
              Net Value
            </Text>
          </VStack>
          <VStack spacing={1} align="flex-end" minW={0}>
            <HStack spacing={1}>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight={800}
                lineHeight={1}
                color={rewardsColor}
              >
                {safeVal(netFormatted)}
              </Text>
              <Text fontSize="sm" color={rewardsColor} aria-hidden>
                {rewardsArrow}
              </Text>
            </HStack>
            <Text fontSize="xs" color="neutral.400">
              Net Rewards
            </Text>
          </VStack>
        </Grid>

        {/* Debug Info */}
        {process.env.NEXT_PUBLIC_DEBUG_SORT === "1" && (
          <div className="text-xs opacity-60">
            nv={coerceNetValue(userNetValue)} tvl=
            {parseMoneyString(vault?.tvm?.formatted)} connected=
            {String(Boolean(isConnected))}
          </div>
        )}

        {/* Action */}
        <VStack
          spacing={2}
          align={{ base: "stretch", md: "end" }}
          w="100%"
          minW={0}
          sx={{ "@media (max-width: 768px)": { minHeight: "56px" } }}
        >
          <Box px={{ base: 3, md: 0 }} w="100%">
            <ConnectGate
              fallbackLabel="Connect wallet to withdraw"
              fullWidth
              overrideChainId={cellarConfig?.chain?.id}
            >
              {needsSwitch ? (
                <Popover placement="bottom" isLazy>
                  <PopoverTrigger>
                    <ActionButton
                      variantStyle="primary"
                      size="md"
                      fullWidth
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation()
                        }
                      }}
                    >
                      Switch network to proceed
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
                      !canWithdraw || !vault?.slug
                        ? "ghost"
                        : "primary"
                    }
                    size="md"
                    fullWidth
                    isDisabled={!canWithdraw || !vault?.slug}
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (!vault?.slug) return
                      setIsOpen({
                        id: vault.slug,
                        type: "withdraw" as DepositModalType,
                      })
                    }}
                  >
                    Enter Withdrawal
                  </ActionButton>
                </Tooltip>
              )}
            </ConnectGate>
          </Box>
        </VStack>
      </Grid>
    </Box>
  )
}
