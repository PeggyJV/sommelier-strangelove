import {
  Avatar,
  Badge,
  Box,
  Button,
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
import MetricsRow from "components/ui/MetricsRow"
import {
  useDepositModalStore,
  DepositModalType,
} from "data/hooks/useDepositModalStore"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalance } from "data/hooks/useUserBalance"
import { toEther } from "utils/formatCurrency"
import { useAccount, useSwitchChain } from "wagmi"
import { useRouter } from "next/router"
import ConnectGate from "components/wallet/ConnectGate"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
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
  config?: { chain?: { displayName?: string; id?: string } }
  status?: "active" | "paused" | "withdrawals-only"
  deprecated?: boolean
}

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
    (vault?.provider as any)?.title ||
    (vault?.provider as string) ||
    ""
  const tvl = vault?.tvm?.formatted ?? "–"
  const netValueNum =
    typeof vault?.baseApySumRewards?.value === "string"
      ? parseFloat(vault?.baseApySumRewards?.value as string)
      : (vault?.baseApySumRewards?.value as number | undefined)
  const netFormatted = vault?.baseApySumRewards?.formatted ?? "–"
  const chainName = vault?.config?.chain?.displayName ?? "Ethereum"
  const chainLogo = (vault as any)?.config?.chain?.logoPath
  const status: "active" | "paused" | "withdrawals-only" =
    vault?.status ?? (vault?.deprecated ? "paused" : "paused")

  // Wallet/chain/balance state
  const { isConnected, chain } = useAccount()
  const cellarConfig = vault?.slug
    ? cellarDataMap[vault.slug]?.config
    : undefined
  const { lpToken } = useUserBalance(cellarConfig as any, enabled)
  const { data: lpTokenData } = lpToken
  const { switchChainAsync } = useSwitchChain()
  const desiredChainId = cellarConfig?.chain?.wagmiId
  const needsSwitch = !!desiredChainId && chain?.id !== desiredChainId

  // User net value (manage page logic)
  const stratAddress = cellarConfig?.cellar?.address
  const stratChainId = cellarConfig?.chain?.id
  const { data: userStratData } =
    stratAddress && stratChainId
      ? useUserStrategyData(stratAddress, stratChainId, enabled)
      : ({} as any)

  // Use user's actual net value for withdrawal logic, not the display net value
  const userNetValue =
    userStratData?.userStrategyData?.userData?.netValue?.formatted
  const nv = coerceNetValue(userNetValue)
  const canWithdraw = Number.isFinite(nv) && nv > 0
  const lpTokenDisabled =
    !lpTokenData ||
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <=
      0
  const userNetValueFmt: string | undefined = (userStratData as any)
    ?.userStrategyData?.userData?.netValue?.formatted

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
        gap={{ base: 4, md: 6 }}
        alignItems="center"
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
              <Text fontSize="sm" color="whiteAlpha.800">
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

        {/* KPIs: single-line horizontal rows */}
        <VStack spacing={2} align="stretch">
          <MetricsRow label="TVL" value={safeVal(tvl)} />
          <MetricsRow
            label="Net Value"
            value={safeVal(userNetValueFmt)}
          />
          <MetricsRow
            label="Net Rewards"
            value={`${safeVal(netFormatted)} ${rewardsArrow}`}
            tone={
              typeof netValueNum === "number"
                ? netValueNum >= 0
                  ? "positive"
                  : "negative"
                : "default"
            }
          />
        </VStack>

        {/* Debug Info */}
        {process.env.NEXT_PUBLIC_DEBUG_SORT === "1" && (
          <div className="text-xs opacity-60">
            nv={coerceNetValue(userNetValue)} tvl=
            {parseMoneyString(vault?.tvm?.formatted)} connected=
            {String(Boolean(isConnected))}
          </div>
        )}

        {/* Action */}
        <VStack spacing={2} align={{ base: "stretch", md: "end" }}>
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
                    minW="180px"
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
                    !canWithdraw || !vault?.slug ? "ghost" : "primary"
                  }
                  size="md"
                  minW="180px"
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
        </VStack>
      </Grid>
    </Box>
  )
}
