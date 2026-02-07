import React, { useEffect, useState } from "react"
import {
  Avatar,
  BoxProps,
  Heading,
  HStack,
  Button,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { TokenAssets } from "components/TokenAssets"
import { BondButton } from "components/_buttons/BondButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { WithdrawQueueButton } from "components/_buttons/WithdrawQueueButton"
import { BaseButton } from "components/_buttons/BaseButton"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { config as utilConfig } from "utils/config"
import { LighterSkeleton } from "components/_skeleton"
import { cellarDataMap } from "data/cellarDataMap"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useWithdrawRequestStatus } from "data/hooks/useWithdrawRequestStatus"
import { getTokenConfig, Token } from "data/tokenConfig"
import {
  isBondedDisabled,
  isBondingEnabled,
  isRewardsEnabled,
  isWithdrawQueueEnabled,
  lpTokenTooltipContent,
  showNetValueInAsset,
} from "data/uiConfig"
import { formatDistanceToNowStrict, isFuture } from "date-fns"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useRouter } from "next/router"
import { FaExternalLinkAlt } from "react-icons/fa"
import { toEther, formatUSD } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { formatDistance } from "utils/formatDistance"
import { useAccount } from "wagmi"
import BondingTableCard from "../BondingTableCard"
import { InnerCard } from "../InnerCard"
import { TransparentCard } from "../TransparentCard"
import { Rewards } from "./Rewards"
import WithdrawQueueCard from "../WithdrawQueueCard"
import { CellarKey, CellarNameKey, ConfigProps } from "data/types"
import { MerklePoints } from "./MerklePoints/MerklePoints"
import { WrongNetworkBanner } from "components/_banners/WrongNetworkBanner"

export const PortfolioCard = (props: BoxProps) => {
  const theme = useTheme()
  const isMounted = useIsMounted()
  const {
    address,
    isConnected: connected,
    chain: wagmiChain,
  } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const dashboard = cellarDataMap[id].dashboard
  const { setIsOpen } = useDepositModalStore()
  const isAlphaSteth = id === utilConfig.CONTRACT.ALPHA_STETH.SLUG
  const isRealYieldEth =
    id === utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG
  const isTurboSteth = id === utilConfig.CONTRACT.TURBO_STETH.SLUG

  // Source vault configs for migration eligibility (safe lookups; use deterministic dummy)
  const RYE_SLUG = utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG
  const TSTETH_SLUG = utilConfig.CONTRACT.TURBO_STETH.SLUG
  const realYieldEthEntry = cellarDataMap[RYE_SLUG]
  const turboStethEntry = cellarDataMap[TSTETH_SLUG]

  const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
  const DUMMY_CONFIG: ConfigProps = {
    id: "dummy",
    cellarNameKey: cellarConfig.cellarNameKey,
    lpToken: { address: ZERO_ADDR, imagePath: "" },
    cellar: {
      address: ZERO_ADDR,
      abi: [] as any,
      key: CellarKey.CELLAR_V0816,
      decimals: 18,
    },
    baseAsset: {
      src: "",
      alt: "dummy",
      symbol: "DUMMY",
      address: ZERO_ADDR,
      coinGeckoId: "",
      decimals: 18,
      chain: cellarConfig.chain.id,
    },
    chain: cellarConfig.chain,
  }

  const realYieldEthConfig = realYieldEthEntry?.config || DUMMY_CONFIG
  const turboStethConfig = turboStethEntry?.config || DUMMY_CONFIG

  const depositTokens = cellarDataMap[id].depositTokens.list
  const depositTokenConfig = getTokenConfig(
    depositTokens,
    cellarConfig.chain.id
  ) as Token[]

  const [isConnected, setConnected] = useState(false)
  useEffect(() => {
    setConnected(connected)
  }, [connected])

  const { lpToken } = useUserBalance(cellarConfig)
  let { data: lpTokenData } = lpToken

  // Balances in potential source vaults for migration (only when connected)
  const { lpToken: realYieldEthBalance } = useUserBalance(
    realYieldEthConfig,
    isConnected && Boolean(realYieldEthEntry)
  )
  const { lpToken: turboStethBalance } = useUserBalance(
    turboStethConfig,
    isConnected && Boolean(turboStethEntry)
  )
  const { data: strategyData, isLoading: isStrategyLoading } =
    useStrategyData(
      cellarConfig.cellar.address,
      cellarConfig.chain.id
    )
  let { data: userData, isLoading: isUserDataLoading } =
    useUserStrategyData(
      cellarConfig.cellar.address,
      cellarConfig.chain.id
    )

  const activeAsset = strategyData?.activeAsset
  const stakingEnd = strategyData?.stakingEnd

  const isStakingAllowed = stakingEnd?.endDate
    ? isFuture(stakingEnd.endDate)
    : false

  // For Neutron BTC Vault, enable buttons based on cellarConfig since strategyData may not load
  const isNeutronVault = id === utilConfig.CONTRACT.NEUTRON_BTC_VAULT?.SLUG
  const buttonsEnabled = isNeutronVault
    ? cellarConfig.chain.wagmiId === wagmiChain?.id
    : strategyData?.config.chain.wagmiId === wagmiChain?.id
  const isWrongNetwork = Boolean(
    strategyData &&
      strategyData?.config?.chain?.wagmiId !== wagmiChain?.id
  )

  const netValue = userData?.userStrategyData.userData?.netValue
  const userStakes = userData?.userStakes

  // Calculate combined Net Value (free LP + bonded LP) for legacy vaults
  const bondedAmount = (userStakes as any)?.totalBondedAmount
  const tokenPrice =
    parseFloat((strategyData?.tokenPrice || "0").replace("$", "")) ||
    0
  const bondedValue = bondedAmount?.value
    ? Number(bondedAmount.formatted) * tokenPrice
    : 0
  const freeNetValue = Number(netValue?.value || 0)
  const totalNetValue = freeNetValue + bondedValue
  const totalNetValueFormatted =
    totalNetValue > 0
      ? `$${totalNetValue
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
      : netValue?.formatted

  // For legacy vaults with bonding, show combined total; otherwise show regular net value
  const displayNetValue =
    !isBondedDisabled(cellarConfig) && bondedValue > 0
      ? totalNetValueFormatted
      : netValue?.formatted

  const lpTokenDisabled =
    !lpTokenData || Number(lpTokenData?.value ?? "0") <= 0

  // Check if user has any value in the vault (either LP tokens or net value)
  const hasValueInVault =
    (lpTokenData && Number(lpTokenData?.value ?? "0") > 0) ||
    (netValue && Number(netValue?.value ?? "0") > 0)

  const baseAssetValue =
    userData?.userStrategyData.userData?.netValueInAsset?.formatted

  const baseAssetValueRaw = (
    userData?.userStrategyData.userData?.netValueInAsset as any
  )?.value as number | undefined

  // Compute fallback ETH amount directly from shares × per-share base-asset value
  const perShareBase = (() => {
    const raw = (strategyData as any)?.token?.value as unknown
    if (typeof raw === "number") return raw
    const parsed = parseFloat(String(raw ?? "0").replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
  })()
  const sharesTokens = (() => {
    const raw = (lpTokenData as any)?.formatted as unknown
    const parsed = parseFloat(String(raw ?? "0").replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
  })()
  const alphaEthCalc = sharesTokens * perShareBase

  const alphaEthValueFormatted = isAlphaSteth
    ? (() => {
        if (
          typeof baseAssetValueRaw === "number" &&
          baseAssetValueRaw > 0
        )
          return baseAssetValueRaw.toFixed(4)
        if (Number.isFinite(alphaEthCalc) && alphaEthCalc > 0)
          return alphaEthCalc.toFixed(4)
        return undefined
      })()
    : undefined

  const isActiveWithdrawRequest =
    useWithdrawRequestStatus(cellarConfig)

  // Show migration button only if on Alpha STETH page, correct chain, and user has
  // a positive balance in either Real-Yield-ETH or Turbo-STETH
  const realYieldEthValue = realYieldEthBalance?.data?.value ?? 0n
  const turboStethValue = turboStethBalance?.data?.value ?? 0n
  const hasMigrationSourceBalance =
    realYieldEthValue > 0n || turboStethValue > 0n

  // Show migration button on Alpha stETH page if user has source balances,
  // or on source vault pages (Real Yield ETH / Turbo stETH) if user has balance there
  const showMigrationButton = Boolean(
    buttonsEnabled &&
      ((isAlphaSteth && hasMigrationSourceBalance) ||
        (isRealYieldEth && realYieldEthValue > 0n) ||
        (isTurboSteth && turboStethValue > 0n))
  )

  const isMobile = useBetterMediaQuery("(max-width: 768px)")

  const compactUSD = (maybeCurrency?: string) => {
    if (!maybeCurrency) return maybeCurrency
    const num = Number(String(maybeCurrency).replace(/[$,]/g, ""))
    if (!Number.isFinite(num)) return maybeCurrency
    return formatUSD(String(num))
  }
  const netValueCompactMobile = (() => {
    const n = Number(netValue?.value ?? 0)
    if (!Number.isFinite(n) || n <= 0) return displayNetValue
    return formatUSD(String(n))
  })()
  const { addToast } = useBrandedToast()
  const copyToClipboard = async (text?: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      addToast({
        heading: "Copied",
        body: <Text>{text}</Text>,
        status: "success",
        duration: 2000,
      })
    } catch {}
  }

  // Mobile-friendly button labels
  const withdrawQueueLabel = isMobile
    ? "Withdraw"
    : "Enter Withdraw Queue"
  const migrateLabel = isMobile ? "Migrate" : "Migrate to Alpha STETH"
  const depositGuideLabel = isMobile
    ? "Deposit Guide"
    : "Watch Deposit Guide"
  const hasSecondaryValue = showNetValueInAsset(cellarConfig)
  const showDeposit = !strategyData?.deprecated
  const showGuide = id === "Alpha-stETH"
  const DISCONNECTED_PLACEHOLDER = "--"

  // Resolve display strings with a strict disconnected placeholder
  const resolvedNetValue = isConnected
    ? (isMobile ? netValueCompactMobile : displayNetValue) || "--"
    : DISCONNECTED_PLACEHOLDER
  const resolvedEthValue = isConnected
    ? alphaEthValueFormatted ??
      (sharesTokens > 0 && perShareBase > 0
        ? (sharesTokens * perShareBase).toFixed(4)
        : "--")
    : DISCONNECTED_PLACEHOLDER
  return (
    <TransparentCard
      {...props}
      backgroundColor="surface.secondary"
      p={{ base: 4, md: 8 }}
      overflow="hidden"
      zIndex={1}
    >
      <VStack align="stretch" spacing={8}>
        <CardStatRow
          gap={{ base: 3, md: 8, lg: 12 }}
          align="flex-start"
          justify="flex-start"
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            minW={0}
            gap={{ base: 3, md: 4 }}
            templateColumns={{
              base: hasSecondaryValue
                ? "repeat(2, minmax(0, 1fr))"
                : "1fr",
              md: "repeat(2, max-content)",
            }}
          >
            <CardStat
              label="Net Value"
              tooltip={
                !isBondedDisabled(cellarConfig) && bondedValue > 0
                  ? `Total value of ${freeNetValue.toFixed(
                      2
                    )} USD (free LP) + ${bondedValue.toFixed(
                      2
                    )} USD (bonded LP) in the strategy`
                  : "Net value of assets in the strategy including SOMM rewards"
              }
            >
              <HStack
                onClick={() =>
                  resolvedNetValue !== DISCONNECTED_PLACEHOLDER &&
                  copyToClipboard(resolvedNetValue)
                }
                cursor="pointer"
              >
                {isMounted && (
                  <Text as="span">{resolvedNetValue}</Text>
                )}
              </HStack>
            </CardStat>

            {hasSecondaryValue &&
              (isAlphaSteth ? (
                <CardStat
                  label="ETH Value"
                  tooltip={
                    <Text>
                      Total value denominated in ETH (stETH ≈ ETH).
                      Excludes SOMM rewards
                    </Text>
                  }
                >
                  <HStack
                    onClick={() =>
                      resolvedEthValue !== DISCONNECTED_PLACEHOLDER &&
                      copyToClipboard(resolvedEthValue)
                    }
                    cursor="pointer"
                  >
                    {isMounted && (
                      <Text as="span">{resolvedEthValue}</Text>
                    )}
                  </HStack>
                </CardStat>
              ) : (
                <CardStat
                  label="Base Asset Value"
                  tooltip={
                    <Text>
                      Total value of assets denominated in base asset
                      <Avatar
                        ml="-2.5px"
                        boxSize={6}
                        src={activeAsset?.src}
                        name={activeAsset?.alt}
                        borderWidth={2}
                        borderColor="surface.bg"
                        bg="surface.bg"
                      />
                      {activeAsset?.symbol}. excluding SOMM rewards
                    </Text>
                  }
                >
                  <HStack
                    onClick={() => copyToClipboard(baseAssetValue)}
                    cursor="pointer"
                  >
                    {isMounted &&
                      (isConnected ? (
                        <Text as="span">
                          {isMobile
                            ? compactUSD(baseAssetValue)
                            : baseAssetValue}
                        </Text>
                      ) : (
                        "--"
                      ))}
                  </HStack>
                </CardStat>
              ))}

            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
              gridColumn={{
                base: hasSecondaryValue ? "1 / -1" : "auto",
                md: "1 / -1",
              }}
            >
              <TokenAssets
                tokens={depositTokenConfig}
                activeAsset={activeAsset?.address || ""}
                displaySymbol
              />
            </CardStat>
            {/* TODO: Verify PNL result */}
            {/* <CardStat
              label="pnl"
              tooltip={`${
                ((outputUserData.data.pnl &&
                  outputUserData.data.pnl.value.toFixed(5, 0)) ||
                  "...") + "%"
              }: This represents percentage gains compared to current deposits`}
              labelProps={{
                textTransform: "uppercase",
              }}
            >
              {isConnected ? (
                <Apy
                  apy={
                    (outputUserData.data.pnl &&
                      `${outputUserData.data.pnl.formatted}`) ||
                    "..."
                  }
                />
              ) : (
                "--"
              )}
            </CardStat> */}
            <Stack spacing={4} direction="column" align="flex-start">
              {isMounted &&
                (isConnected ? (
                  <>
                    <VStack
                      spacing={3}
                      width="100%"
                      paddingTop={"1em"}
                    >
                      {/* Row 1: Deposit (primary) + Watch Guide (secondary) */}
                      <SimpleGrid
                        columns={{
                          base: 1,
                          sm: showDeposit && showGuide ? 2 : 1,
                          md: 2,
                        }}
                        gap={{ base: 2, md: 3 }}
                        width="100%"
                        overflow="visible"
                      >
                        {showDeposit && (
                          <DepositButton
                            width={{ base: "100%", md: "100%" }}
                            disabled={
                              !isConnected ||
                              strategyData?.isContractNotReady ||
                              !buttonsEnabled
                            }
                          />
                        )}
                        {showGuide && (
                          <Button
                            as={NextLink}
                            href="/strategies/Alpha-stETH/deposit_guide"
                            size={{ base: "sm", md: "md" }}
                            height={{ base: "40px", md: "44px" }}
                            variant="outline"
                            bg="transparent"
                            color="cta.outline.fg"
                            borderColor="cta.outline.br"
                            borderWidth="2px"
                            width={{ base: "100%", md: "100%" }}
                            sx={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: { base: "sm", md: "md" },
                              px: { base: 3, md: 4 },
                            }}
                            _focusVisible={{
                              boxShadow:
                                "0 0 0 3px var(--chakra-colors-purple-base)",
                            }}
                          >
                            {depositGuideLabel}
                          </Button>
                        )}
                      </SimpleGrid>
                      {/*
                      <>
                        <WithdrawQueueButton
                          chain={cellarConfig.chain}
                          buttonLabel="Enter Withdraw Queue"
                          disabled={
                            lpTokenDisabled ||
                            !buttonsEnabled ||
                            isActiveWithdrawRequest
                          }
                          showTooltip={true}
                        />
                      </>
                        */}
                      {/* Row 2: network CTA or Withdraw/Migrate */}
                      {isWrongNetwork ? (
                        <WrongNetworkBanner
                          chain={cellarConfig.chain}
                        />
                      ) : (
                        <SimpleGrid
                          columns={{ base: 1, sm: 2, md: 2 }}
                          gap={{ base: 2, md: 3 }}
                          mt={{ base: 2, md: 3 }}
                          width="100%"
                          minW={0}
                        >
                          {isWithdrawQueueEnabled(cellarConfig) ? (
                            <WithdrawQueueButton
                              chain={cellarConfig.chain}
                              buttonLabel={withdrawQueueLabel}
                              disabled={
                                !hasValueInVault || !buttonsEnabled
                              }
                              showTooltip={true}
                              width={{ base: "100%", md: "100%" }}
                            />
                          ) : (
                            <WithdrawButton
                              isDeprecated={strategyData?.deprecated}
                              disabled={
                                !hasValueInVault || !buttonsEnabled
                              }
                              width={{ base: "100%", md: "100%" }}
                            />
                          )}

                          {showMigrationButton && (
                            <BaseButton
                              onClick={() =>
                                setIsOpen({ id, type: "migrate" })
                              }
                              variant="outline"
                              bg="transparent"
                              color="cta.outline.fg"
                              borderColor="cta.outline.br"
                              borderWidth="2px"
                              width={{ base: "100%", md: "100%" }}
                              sx={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {migrateLabel}
                            </BaseButton>
                          )}
                        </SimpleGrid>
                      )}
                    </VStack>
                  </>
                ) : (
                  <>
                    <VStack
                      spacing={3}
                      width="100%"
                      paddingTop={"1em"}
                      align="flex-start"
                    >
                      <HStack>
                        <ConnectButton
                          overridechainid={cellarConfig.chain.id}
                        />
                      </HStack>
                      {id === "Alpha-stETH" && (
                        <Button
                          as={NextLink}
                          href="/strategies/Alpha-stETH/deposit_guide"
                          size="md"
                          height="44px"
                          variant="outline"
                          bg="transparent"
                          color="cta.outline.fg"
                          borderColor="cta.outline.br"
                          borderWidth="2px"
                          width={{ base: "100%", md: "auto" }}
                          _focusVisible={{
                            boxShadow:
                              "0 0 0 3px var(--chakra-colors-purple-base)",
                          }}
                        >
                          Watch Deposit Guide
                        </Button>
                      )}
                    </VStack>
                  </>
                ))}
            </Stack>
          </SimpleGrid>
          {!isBondedDisabled(cellarConfig) ? (
            <>
              <SimpleGrid
                templateColumns="repeat(2, max-content)"
                templateRows="repeat(2, 1fr)"
                spacing={4}
                alignItems="flex-end"
              >
                <VStack align="flex-start">
                  <CardStat
                    label="Available LP Tokens"
                    tooltip={lpTokenTooltipContent(cellarConfig)}
                  >
                    {cellarConfig.lpToken.imagePath && (
                      <Image
                        src={cellarConfig.lpToken.imagePath}
                        alt="lp token image"
                        height="24px"
                        mr={2}
                      />
                    )}
                    {isMounted &&
                      (isConnected
                        ? (lpTokenData &&
                            toEther(
                              lpTokenData.value,
                              lpTokenData.decimals,
                              true,
                              2
                            )) ||
                          "..."
                        : "--")}
                  </CardStat>
                </VStack>
                {isBondingEnabled(cellarConfig) && (
                  <>
                    <VStack align="flex-start">
                      <CardStat
                        label="Bonded LP Tokens"
                        tooltip="Bonded LP tokens earn yield from the vault and liquidity mining rewards"
                      >
                        {isMounted &&
                          (isConnected
                            ? (userStakes as any)?.totalBondedAmount
                                ?.formatted || "..."
                            : "--")}
                      </CardStat>
                    </VStack>
                    {isMounted &&
                      /* isMerkleRewardsException(cellarConfig) || */ isStakingAllowed && (
                        <BondButton
                          disabled={
                            lpTokenDisabled || !buttonsEnabled
                          }
                        />
                      )}
                  </>
                )}
              </SimpleGrid>
              {isRewardsEnabled(cellarConfig) && (
                <Rewards cellarConfig={cellarConfig} />
              )}
            </>
          ) : (
            <VStack align="flex-start">
              <CardStat
                label="tokens"
                tooltip={lpTokenTooltipContent(cellarConfig)}
              >
                {cellarConfig.lpToken.imagePath && (
                  <Image
                    src={cellarConfig.lpToken.imagePath}
                    alt="lp token image"
                    height="24px"
                    mr={2}
                  />
                )}
                {isMounted &&
                  (isConnected
                    ? (lpTokenData &&
                        toEther(
                          lpTokenData.value,
                          lpTokenData.decimals,
                          false,
                          6
                        )) ||
                      "..."
                    : "--")}
              </CardStat>
            </VStack>
          )}

          {(cellarConfig.cellarNameKey ===
            CellarNameKey.REAL_YIELD_ETH_ARB ||
            cellarConfig.cellarNameKey ===
              CellarNameKey.REAL_YIELD_USD_ARB ||
            cellarConfig.cellarNameKey ===
              CellarNameKey.REAL_YIELD_ETH_OPT) && (
            <MerklePoints
              userAddress={address}
              cellarConfig={cellarConfig}
            />
          )}

          <CardStat label="Strategy Dashboard">
            {strategyData ? (
              <HStack
                as={Link}
                href={`${dashboard}`}
                target="_blank"
                rel="noreferrer"
              >
                <Text as="span" fontWeight="bold" fontSize={21}>
                  {strategyData?.name}
                </Text>
                <Icon as={FaExternalLinkAlt} color="purple.base" />
              </HStack>
            ) : (
              <Text>Loading...</Text>
            )}
          </CardStat>
        </CardStatRow>
        {isBondingEnabled(cellarConfig) && (
          <>
            {(userStakes as any) &&
              !(userStakes as any).userStakes?.length &&
              stakingEnd?.endDate &&
              isFuture(stakingEnd?.endDate) && (
                <>
                  {cellarConfig.customReward
                    ?.customRewardLongMessage ? (
                    <InnerCard
                      backgroundColor="surface.tertiary"
                      mt={8}
                      px={7}
                      py={7}
                    >
                      <Stack
                        flexDir={{ base: "column", md: "row" }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        gap={{ base: 0, md: 4 }}
                      >
                        <>
                          <Image
                            src={cellarConfig.customReward?.imagePath}
                            alt={`${cellarConfig.customReward?.tokenSymbol} logo`}
                            boxSize={6}
                          />
                          <Heading size="16px">
                            {
                              cellarConfig.customReward
                                ?.customRewardLongMessage
                            }
                          </Heading>
                        </>

                        <Spacer />
                        <LighterSkeleton
                          isLoaded={!isStrategyLoading}
                          height={4}
                        >
                          <Text fontSize="xs">
                            {stakingEnd?.endDate &&
                            isFuture(stakingEnd.endDate)
                              ? `Rewards program ends in ${formatDistanceToNowStrict(
                                  cellarConfig.customReward
                                    ?.stakingDurationOverride ??
                                    stakingEnd.endDate,
                                  {
                                    locale: { formatDistance },
                                  }
                                )}`
                              : "Program Ended"}
                          </Text>
                        </LighterSkeleton>
                      </Stack>
                    </InnerCard>
                  ) : null}
                  {cellarConfig.customReward?.showSommRewards ||
                  cellarConfig.customReward?.showSommRewards ===
                    undefined ? (
                    <InnerCard
                      backgroundColor="surface.tertiary"
                      mt={8}
                      px={7}
                      py={7}
                    >
                      <Stack
                        flexDir={{ base: "column", md: "row" }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        gap={{ base: 0, md: 4 }}
                      >
                        <Image
                          src="/assets/icons/somm.png"
                          alt="somm logo"
                          boxSize={6}
                        />
                        <Heading size="16px">
                          Earn{" "}
                          <span
                            style={{
                              color: theme.colors.lime.base,
                            }}
                          >
                            {strategyData?.rewardsApy?.formatted}
                          </span>{" "}
                          APY in SOMM rewards when you bond.
                        </Heading>
                        <Spacer />
                        <LighterSkeleton
                          isLoaded={!isStrategyLoading}
                          height={4}
                        >
                          <Text fontSize="xs">
                            {stakingEnd?.endDate &&
                            isFuture(stakingEnd.endDate)
                              ? `Rewards program ends in ${formatDistanceToNowStrict(
                                  stakingEnd.endDate,
                                  {
                                    locale: { formatDistance },
                                  }
                                )}`
                              : "Program Ended"}
                          </Text>
                        </LighterSkeleton>
                      </Stack>
                    </InnerCard>
                  ) : null}
                </>
              )}
            {isConnected && (
              <LighterSkeleton
                h={!isUserDataLoading ? "none" : "100px"}
                borderRadius={24}
                isLoaded={!isUserDataLoading}
              >
                {isConnected &&
                  Boolean(
                    (userStakes as any) &&
                      (userStakes as any).userStakes?.length
                  ) && <BondingTableCard />}
              </LighterSkeleton>
            )}
            {isConnected && isActiveWithdrawRequest && (
              <LighterSkeleton
                h={!isUserDataLoading ? "none" : "100px"}
                borderRadius={24}
                isLoaded={!isUserDataLoading}
              >
                {isConnected && <WithdrawQueueCard />}
              </LighterSkeleton>
            )}
          </>
        )}
      </VStack>
    </TransparentCard>
  )
}
