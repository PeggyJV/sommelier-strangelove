import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ErrorCard } from "components/_cards/ErrorCard"
import { StrategyDesktopColumn } from "components/_columns/StrategyDesktopColumn"
import { StrategyMobileColumn } from "components/_columns/StrategyMobileColumn"
import { StrategyTabColumn } from "components/_columns/StrategyTabColumn"
import { LayoutWithSidebar } from "components/_layout/LayoutWithSidebar"
import { SommelierTab } from "components/_modals/DepositModal/SommelierTab"
import { ModalWithExchangeTab } from "components/_modals/ModalWithExchangeTab"
import { WithdrawModal } from "components/_modals/WithdrawModal"
import { TransparentSkeleton } from "components/_skeleton"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import {
  DepositModalType,
  useDepositModalStore,
} from "data/hooks/useDepositModalStore"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useMemo, useState, useCallback } from "react"
import { chainConfig } from "src/data/chainConfig"
import { SymbolPathPair } from "components/_filters/DepositTokenFilter"
import { cellarDataMap } from "src/data/cellarDataMap"
import { CellarData } from "src/data/types"
import { MiscFilterProp } from "components/_filters/MiscFilter"

import { add, isBefore } from "date-fns"
import { useAccount } from "wagmi"
import { StrategyData } from "data/actions/types"
import { useUserBalances } from "data/hooks/useUserBalances"
import TopLaunchBanner from "components/_sections/TopLaunchBanner"
import WithdrawalWarningBanner from "components/_sections/WithdrawalWarningBanner"
import { sortVaults } from "utils/sortVaults"

import SectionHeader from "components/_sections/SectionHeader"
import { alphaSteth } from "data/strategies/alpha-steth"
import { MigrationModal } from "components/_modals/MigrationModal"
import LegacyVaultCard from "components/_vaults/LegacyVaultCard"

export const PageHome = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    isRefetching,
  } = useAllStrategiesData()
  const isMobile = useBetterMediaQuery("(max-width: 900px)")
  const isTab = useBetterMediaQuery("(max-width: 1600px)")
  const isDesktop = !isTab && !isMobile

  const {
    isOpen,
    onClose,
    setIsOpen,
    type: modalType,
    id,
  } = useDepositModalStore()

  const { isConnected } = useAccount()
  const { userBalances } = useUserBalances()

  const columns = useMemo(() => {
    return isDesktop
      ? StrategyDesktopColumn({
          onDepositModalOpen: ({
            id,
            type,
          }: {
            id: string
            type: DepositModalType
          }) => {
            setIsOpen({
              id,
              type,
            })
          },
        })
      : isTab && !isMobile
      ? StrategyTabColumn({
          onDepositModalOpen: ({
            id,
            type,
          }: {
            id: string
            type: DepositModalType
          }) => {
            setIsOpen({
              id,
              type,
            })
          },
        })
      : StrategyMobileColumn()
  }, [isDesktop, isTab, isMobile, setIsOpen])

  const allChainIds = chainConfig.map((chain) => chain.id)

  //Get all deposit assets from all strategies and turn it into a set of unique values
  const {
    uniqueAssetsMap,
    constantAllUniqueAssetsArray,
  }: {
    uniqueAssetsMap: Record<string, SymbolPathPair>
    constantAllUniqueAssetsArray: SymbolPathPair[]
  } = useMemo(() => {
    let allDepositAssets = Object.values(cellarDataMap)
      .map((cellarData: CellarData): SymbolPathPair[] => {
        // Don't include deprecated strategies
        if (cellarData.deprecated) {
          return []
        }
        return cellarData.depositTokens.list.map((symbol) => ({
          symbol: symbol,
          path: `/assets/icons/${symbol.toLowerCase()}.png`,
        }))
      })
      .flat()

    // Create an object to ensure uniqueness
    const uniqueAssetsMap: Record<string, SymbolPathPair> = {}

    allDepositAssets.forEach((pair: SymbolPathPair) => {
      if (!uniqueAssetsMap[pair.symbol]) {
        uniqueAssetsMap[pair.symbol] = pair
      }
    })
    // Copy the unique assets into a constants array
    const constantAllUniqueAssetsArray =
      Object.values(uniqueAssetsMap)

    return { uniqueAssetsMap, constantAllUniqueAssetsArray }
  }, [cellarDataMap])

  // Always float up "WETH", "USDC", "WBTC", "SOMM", "stETH" to the top of the list in that order for the inital render
  const constantOrderedAllUniqueAssetsArray = useMemo(() => {
    return [
      ...constantAllUniqueAssetsArray.filter(
        (pair) => pair.symbol === "WETH"
      ),
      ...constantAllUniqueAssetsArray.filter(
        (pair) => pair.symbol === "USDC"
      ),
      ...constantAllUniqueAssetsArray.filter(
        (pair) => pair.symbol === "WBTC"
      ),
      ...constantAllUniqueAssetsArray.filter(
        (pair) => pair.symbol === "SOMM"
      ),
      ...constantAllUniqueAssetsArray.filter(
        (pair) => pair.symbol === "stETH"
      ),
      ...constantAllUniqueAssetsArray.filter(
        (pair) =>
          pair.symbol !== "WETH" &&
          pair.symbol !== "USDC" &&
          pair.symbol !== "WBTC" &&
          pair.symbol !== "SOMM" &&
          pair.symbol !== "stETH"
      ),
    ]
  }, [constantAllUniqueAssetsArray])

  const [selectedChainIds, setSelectedChainIds] =
    useState<string[]>(allChainIds)

  const [selectedDepositAssets, setSelectedDepositAssets] =
    useState<Record<string, SymbolPathPair>>(uniqueAssetsMap)

  const [showDeprecated, setShowDeprecated] = useState<boolean>(false)
  const [showIncentivised, setShowIncentivised] =
    useState<boolean>(false)

  const [selectedMiscFilters, setSelectedMiscFilters] = useState<
    MiscFilterProp[]
  >([
    {
      name: "Incentivised",
      checked: showIncentivised,
      stateSetFunction: setShowIncentivised,
    },
    {
      name: "Deprecated",
      checked: showDeprecated,
      stateSetFunction: setShowDeprecated,
    },
  ])

  // Reset Button Helpers, consider moving to a separate file

  // All the params necessary for the reset button (initial filter states)
  const initialChainIds = allChainIds
  const initialDepositAssets = uniqueAssetsMap
  const initialShowDeprecated = false
  const initialShowIncentivised = false

  const hasFiltersChanged = useMemo(() => {
    return (
      !(
        JSON.stringify(selectedChainIds) !==
        JSON.stringify(initialChainIds)
      ) ||
      !(
        JSON.stringify(selectedDepositAssets) !==
        JSON.stringify(initialDepositAssets)
      ) ||
      showDeprecated !== initialShowDeprecated ||
      showIncentivised !== initialShowIncentivised
    )
  }, [
    selectedChainIds,
    selectedDepositAssets,
    showDeprecated,
    showIncentivised,
  ])

  const resetFilters = useCallback(() => {
    setSelectedChainIds(initialChainIds)
    setSelectedDepositAssets(initialDepositAssets)
    setShowDeprecated(initialShowDeprecated)
    setShowIncentivised(initialShowIncentivised)

    // Update selectedMiscFilters to reflect the reset state in MiscFilter
    setSelectedMiscFilters([
      {
        name: "Incentivised",
        checked: initialShowIncentivised,
        stateSetFunction: setShowIncentivised,
      },
      {
        name: "Deprecated",
        checked: initialShowDeprecated,
        stateSetFunction: setShowDeprecated,
      },
    ])
  }, [])

  const strategyData = useMemo(() => {
    const filteredData = data || []
    return filteredData.sort((a, b) => {
      // Move Alpha stETH to the top of the list
      if (a?.slug === "Alpha-stETH") {
        return -1
      }
      if (b?.slug === "Alpha-stETH") {
        return 1
      }

      // 1. Priority - strategies deposit assets that user holds
      if (isConnected && userBalances.data) {
        for (const balance of userBalances.data) {
          const doesStrategyHaveAsset = (strategy: StrategyData) =>
            strategy?.depositTokens?.some((asset) => {
              // if user has ETH consider it as they had WETH
              if (
                balance.symbol.toUpperCase() === "ETH" &&
                asset.toUpperCase() === "WETH"
              ) {
                return true
              }
              return (
                asset.toUpperCase() === balance.symbol.toUpperCase()
              )
            })
          const strategyAHasAsset = doesStrategyHaveAsset(a)
          const strategyBHasAsset = doesStrategyHaveAsset(b)

          if (
            (strategyAHasAsset || strategyBHasAsset) &&
            !(strategyAHasAsset && strategyBHasAsset)
          ) {
            return strategyAHasAsset ? -1 : 1
          }
        }
      }
      // 2. Priority - new strategies
      const isNewStrategy = (strategy: StrategyData) =>
        isBefore(
          new Date(),
          add(new Date(strategy?.launchDate ?? ""), { weeks: 4 })
        )
      const isANew = isNewStrategy(a)
      const isBNew = isNewStrategy(b)
      if (isANew && isBNew) {
        return (
          new Date(b?.launchDate ?? "").getTime() -
          new Date(a?.launchDate ?? "").getTime()
        )
      } else if (isANew || isBNew) {
        return isANew ? -1 : 1
      }

      // 3. Priority - Somm rewards
      //if ((a?.rewardsApy || b?.rewardsApy) && !(a?.rewardsApy && b?.rewardsApy)) {
      //return a?.rewardsApy ? -1 : 1;
      //}

      // 4. Priority - TVL
      return (
        parseFloat(b?.tvm?.value ?? "") -
        parseFloat(a?.tvm?.value ?? "")
      )
    })
  }, [data?.length, userBalances.data, isConnected])

  const bannerTargetDate: Date =
    alphaSteth.launchDate ??
    new Date(Date.UTC(2025, 7, 19, 0, 0, 0, 0))

  const { sommNative, legacy } = useMemo(() => {
    const list = strategyData || []
    const sommNative = list.filter((v) => v?.isSommNative)
    const legacy = list.filter((v) => !v?.isSommNative)

    // Normalize to util input shape and sort deterministically
    const mapToSortable = (arr: any[]) =>
      arr.map((v) => ({
        ref: v,
        name: v?.name,
        metrics: { tvl: Number(v?.tvm?.value ?? 0) },
        user: {
          netValue: Number(
            v?.userStrategyData?.userData?.netValue?.value ?? 0
          ),
        },
      }))

    const sortedLegacy = sortVaults(mapToSortable(legacy), isConnected).map(
      (x) => x.ref
    )

    const sortedSomm = sortVaults(mapToSortable(sommNative), isConnected).map(
      (x) => x.ref
    )

    return { sommNative: sortedSomm, legacy: sortedLegacy }
  }, [strategyData, isConnected, userBalances?.data])

  const WithdrawalStatusPanel = () => (
    <Box
      mt={6}
      mb={4}
      borderWidth="1px"
      borderColor="surface.secondary"
      rounded="xl"
      px={4}
      py={3}
      bg="surface.primary"
    >
      <Text fontSize="sm" color="neutral.300">
        Legacy vaults may have paused deposits. Review withdrawal
        options in each vault’s details.
      </Text>
    </Box>
  )

  // ColumnHeaders removed (no longer used)

  const loading = isFetching || isRefetching || isLoading
  return (
    <LayoutWithSidebar>
      <TopLaunchBanner targetDate={bannerTargetDate} blogHref="#" />
      {/*
        <InfoBanner
          text={
            "A new SOMM incentive proposal for Real Yield ETH on Arbitrum is progressing through governance. If it passes, rewards will begin on March 17."
            "New incentive programs for Real Yield ETH (on Ethereum) Real Yield BTC and Real Yield USD (on Arbitrum) are progressing through governance. If they pass, rewards will begin flowing on March 24"
          }
        />
      }
      */}
      {/* Filters removed – always show full vault list */}
      <TransparentSkeleton
        height={loading ? "400px" : "auto"}
        w="full"
        borderRadius={"1em"}
        isLoaded={!loading}
      >
        {isError ? (
          <ErrorCard message="" py="100px">
            <Center>
              <Button
                w="100px"
                variant="outline"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </Center>
          </ErrorCard>
        ) : (
          <>
            {sommNative.length > 0 && (
              <>
                <SectionHeader title="Somm-native Vaults" />
                <StrategyTable
                  columns={columns}
                  data={sommNative}
                  showHeader={false}
                />
              </>
            )}

            {legacy.length > 0 && (
              <>
                <SectionHeader
                  title={
                    <>
                      Legacy Vaults (Managed by{" "}
                      <a
                        href="https://sevenseas.capital/"
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: "underline" }}
                      >
                        Seven Seas
                      </a>
                      )
                    </>
                  }
                />
                <WithdrawalWarningBanner />
                <VStack spacing={4} align="stretch" mt={2}>
                  {legacy.map((v) => (
                    <LegacyVaultCard
                      key={v?.slug ?? v?.name}
                      vault={v}
                    />
                  ))}
                </VStack>
              </>
            )}
          </>
        )}

        {id && (
          <>
            <ModalWithExchangeTab
              heading="Deposit"
              isOpen={isOpen && modalType === "deposit"}
              onClose={onClose}
              sommelierTab={
                <SommelierTab
                  isOpen={isOpen && modalType === "deposit"}
                  onClose={onClose}
                />
              }
            />
            <WithdrawModal
              isOpen={isOpen && modalType === "withdraw"}
              onClose={onClose}
            />
            <MigrationModal
              isOpen={isOpen && modalType === "migrate"}
              onClose={onClose}
            />
          </>
        )}
      </TransparentSkeleton>
    </LayoutWithSidebar>
  )
}
