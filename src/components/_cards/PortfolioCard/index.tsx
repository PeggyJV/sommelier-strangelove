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
import { toEther } from "utils/formatCurrency"
import { formatDistance } from "utils/formatDistance"
import { useAccount } from "wagmi"
import BondingTableCard from "../BondingTableCard"
import { InnerCard } from "../InnerCard"
import { TransparentCard } from "../TransparentCard"
import { Rewards } from "./Rewards"
import WithdrawQueueCard from "../WithdrawQueueCard"
import { CellarKey, CellarNameKey, ConfigProps } from "data/types"
import { MerklePoints } from "./MerklePoints/MerklePoints"

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

  const buttonsEnabled =
    strategyData?.config.chain.wagmiId === wagmiChain?.id

  if (!buttonsEnabled) {
    userData = undefined
    lpTokenData = undefined
  }

  const netValue = userData?.userStrategyData.userData?.netValue
  const userStakes = userData?.userStakes

  const lpTokenDisabled =
    !lpTokenData || Number(lpTokenData?.value ?? "0") <= 0

  // Check if user has any value in the vault (either LP tokens or net value)
  const hasValueInVault =
    (lpTokenData && Number(lpTokenData?.value ?? "0") > 0) ||
    (netValue && Number(netValue?.value ?? "0") > 0)

  const baseAssetValue =
    userData?.userStrategyData.userData?.netValueInAsset?.formatted

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

  return (
    <TransparentCard
      {...props}
      backgroundColor="surface.secondary"
      p={8}
      overflow="none"
      zIndex={1}
    >
      <VStack align="stretch" spacing={8}>
        <CardStatRow
          gap={{ base: 4, md: 8, lg: 12 }}
          align="flex-start"
          justify="flex-start"
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            templateColumns={{
              base: "repeat(1, max-content)",
              md: "repeat(2, max-content)",
            }}
          >
            <CardStat
              label="Net Value"
              tooltip="Net value of assets in the strategy including SOMM rewards"
            >
              {isMounted &&
                (isConnected ? netValue?.formatted || "..." : "--")}
            </CardStat>

            {showNetValueInAsset(cellarConfig) && (
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
                {isMounted && (isConnected ? baseAssetValue : "--")}
              </CardStat>
            )}

            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
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
            <Stack spacing={3} direction="row">
              {isMounted &&
                (isConnected ? (
                  <>
                    <VStack
                      spacing={3}
                      width="100%"
                      paddingTop={"1em"}
                    >
                      <HStack
                        flexWrap="wrap"
                        rowGap={2}
                        columnGap={3}
                      >
                        {!strategyData?.deprecated && (
                          <DepositButton
                            disabled={
                              !isConnected ||
                              strategyData?.isContractNotReady ||
                              !buttonsEnabled
                            }
                          />
                        )}
                        {!isWithdrawQueueEnabled(cellarConfig) && (
                          <WithdrawButton
                            isDeprecated={strategyData?.deprecated}
                            disabled={
                              !hasValueInVault || !buttonsEnabled
                            }
                          />
                        )}
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
                            _focusVisible={{
                              boxShadow:
                                "0 0 0 3px var(--chakra-colors-purple-base)",
                            }}
                          >
                            Watch Deposit Guide
                          </Button>
                        )}
                      </HStack>
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
                      {isWithdrawQueueEnabled(cellarConfig) && (
                        <WithdrawQueueButton
                          chain={cellarConfig.chain}
                          buttonLabel="Enter Withdraw Queue"
                          disabled={
                            !hasValueInVault || !buttonsEnabled
                          }
                          showTooltip={true}
                        />
                      )}

                      {showMigrationButton && (
                        <BaseButton
                          onClick={() =>
                            setIsOpen({ id, type: "migrate" })
                          }
                        >
                          Migrate to Alpha STETH
                        </BaseButton>
                      )}
                    </VStack>
                  </>
                ) : (
                  <>
                    <HStack paddingTop={"1em"}>
                      <ConnectButton
                        overridechainid={cellarConfig.chain.id}
                      />
                    </HStack>
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
