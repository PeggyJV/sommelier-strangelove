import {
  Button,
  Center,
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
import { useHome } from "data/context/homeContext"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import {
  DepositModalType,
  useDepositModalStore,
} from "data/hooks/useDepositModalStore"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useMemo, useState } from "react"
import { ChainFilter } from "components/_filters/ChainFilter"
import { chainConfig } from "src/data/chainConfig"
import {
  DepositTokenFilter,
  SymbolPathPair,
} from "components/_filters/DepositTokenFilter"
import { cellarDataMap } from "src/data/cellarDataMap"
import { CellarData } from "src/data/types"
import {
  MiscFilter,
  MiscFilterProp,
} from "components/_filters/MiscFilter"
import { isEqual } from "lodash"
import { DeleteCircleIcon } from "components/_icons"
import { add, isBefore } from "date-fns"
import { useAccount, useNetwork } from "wagmi"
import { StrategyData } from "data/actions/types"
import { useUserBalances } from "data/hooks/useUserBalances"

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

  const { timeline } = useHome();
  const { isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { userBalances } = useUserBalances();

  const columns = isDesktop
    ? StrategyDesktopColumn({
        timeline,
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
        timeline,
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
    : StrategyMobileColumn({
        timeline,
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

  const allChainIds = chainConfig.map((chain) => chain.id)

  //Get all deposit assets from all strategies and turn it into a set of unique values
  const allDepositAssets: SymbolPathPair[] = Object.values(
    cellarDataMap
  )
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
  const constantAllUniqueAssetsArray = Object.values(uniqueAssetsMap)

  // Always float up "WETH", "USDC", "WBTC", "SOMM", "stETH" to the top of the list in that order for the inital render
  const constantOrderedAllUniqueAssetsArray = [
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
      !isEqual(selectedChainIds, initialChainIds) ||
      !isEqual(selectedDepositAssets, initialDepositAssets) ||
      showDeprecated !== initialShowDeprecated ||
      showIncentivised !== initialShowIncentivised
    )
  }, [
    selectedChainIds,
    selectedDepositAssets,
    showDeprecated,
    showIncentivised,
  ])

  const resetFilters = () => {
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
  }

  const strategyData = useMemo(() => {
    const filteredData = data?.filter((item) => {
      // Chain filter
      const isChainSelected = selectedChainIds.includes(
        item?.config.chain.id!
      )

      // Deposit asset filter
      const hasSelectedDepositAsset = cellarDataMap[
        item!.slug
        ].depositTokens.list.some((tokenSymbol) =>
        selectedDepositAssets.hasOwnProperty(tokenSymbol)
      )

      // Deprecated filter
      const isDeprecated = cellarDataMap[item!.slug].deprecated
      const deprecatedCondition = showDeprecated
        ? isDeprecated
        : !isDeprecated

      // Incentivised filter
      //    Badge check for custom rewards
      const hasGreenBadge = cellarDataMap[
        item!.slug
        ].config.badges?.some(
        (badge) => badge.customStrategyHighlightColor === "#00C04B"
      )

      //    Staking period check for somm/vesting rewards
      const hasLiveStakingPeriod =
        item?.rewardsApy?.value !== undefined &&
        item?.rewardsApy?.value > 0

      const incentivisedCondition = showIncentivised
        ? hasGreenBadge || hasLiveStakingPeriod
        : true

      return (
        isChainSelected &&
        hasSelectedDepositAsset &&
        deprecatedCondition &&
        incentivisedCondition
      )
    }) || []

    return filteredData.sort((a, b) => {

      // 1. Priority - does user own same assets as in strategy
      if (isConnected && userBalances) {
        for (const balance of userBalances) {
          const doesStrategyHaveAsset = (strategy: StrategyData) => strategy?.tradedAssets?.some(
            asset =>  (strategy.config.chain.wagmiId === currentChain?.id) && (asset.symbol?.toUpperCase() === balance.symbol.toUpperCase())
          )
          const strategyAHasAsset = doesStrategyHaveAsset(a);
          const strategyBHasAsset = doesStrategyHaveAsset(b);

          if ((strategyAHasAsset || strategyBHasAsset) && !(strategyAHasAsset && strategyBHasAsset)) {
            return strategyAHasAsset ? -1 : 1;
          }
        }
      }
      // 2. Priority - new strategies
      const isNewStrategy = (strategy: StrategyData) => isBefore(new Date(), add(new Date(strategy?.launchDate ?? ''), { weeks: 4 }));
      const isANew = isNewStrategy(a);
      const isBNew = isNewStrategy(b);
      if (isANew && isBNew) {
        return new Date(b?.launchDate ?? '').getTime() - new Date(a?.launchDate ?? '').getTime();
      } else if (isANew || isBNew) {
        return isANew ? -1 : 1;
      }

      // 3. Priority - Somm rewards
      if ((a?.rewardsApy || b?.rewardsApy) && !(a?.rewardsApy && b?.rewardsApy)) {
        return a?.rewardsApy ? -1 : 1;
      }

      // 4. Priority - TVL
      return parseFloat(b?.tvm?.value ?? '') - parseFloat(a?.tvm?.value ?? '');
    });
  }, [
    data,
    selectedChainIds,
    selectedDepositAssets,
    showDeprecated,
    showIncentivised,
    userBalances,
    isConnected
  ])

  const loading = isFetching || isRefetching || isLoading
  return (
    <LayoutWithSidebar>
      {/*
        <InfoBanner
          text={
            "New incentive programs for Real Yield ETH (on Ethereum) Real Yield BTC and Real Yield USD (on Arbitrum) are progressing through governance. If they pass, rewards will begin flowing on March 24"
          }
        />
      */}
      {/* <HStack
        p={4}
        mb={6}
        spacing={4}
        align="center"
        justify="center"
        backgroundColor="turquoise.extraDark"
        border="2px solid"
        borderRadius={16}
        borderColor="turquoise.dark"
      >
        <VStack align="center" justify="center">
          <Text textAlign="center">
            Turbo GHO co-incentives are progressing through Aave
            governance and could be funded shortly after Oct 22nd.
            Learn more{" "}
            <Link
              href="https://app.aave.com/governance/proposal/?proposalId=347"
              isExternal
              display="inline-flex"
              alignItems="center"
              fontWeight={600}
            >
              <Text as="span">here</Text>
              <ExternalLinkIcon ml={2} alignSelf="center" />
            </Link>
          </Text>
        </VStack>
      </HStack> */}
      {isMobile ? (
        <VStack width="100%" padding={"2em 0em"} spacing="2em">
          <ChainFilter
            selectedChainIds={selectedChainIds}
            setSelectedChainIds={setSelectedChainIds}
          />
          <DepositTokenFilter
            constantAllUniqueAssetsArray={
              constantOrderedAllUniqueAssetsArray
            }
            selectedDepositAssets={selectedDepositAssets}
            setSelectedDepositAssets={setSelectedDepositAssets}
          />
          <MiscFilter categories={selectedMiscFilters} />
          {hasFiltersChanged && (
            <Button
              bg="none"
              borderWidth={2.5}
              borderColor="purple.base"
              borderRadius="1em"
              w="auto"
              fontFamily="Haffer"
              fontSize={12}
              padding="1.75em 2em"
              _hover={{ bg: "purple.dark" }}
              onClick={resetFilters}
              leftIcon={<Text fontSize={"1.25em"}>Reset</Text>}
              rightIcon={<DeleteCircleIcon boxSize={4} />}
            />
          )}
        </VStack>
      ) : (
        <HStack width="100%" padding={"2em 0em"} spacing="2em">
          <ChainFilter
            selectedChainIds={selectedChainIds}
            setSelectedChainIds={setSelectedChainIds}
          />
          <DepositTokenFilter
            constantAllUniqueAssetsArray={
              constantOrderedAllUniqueAssetsArray
            }
            selectedDepositAssets={selectedDepositAssets}
            setSelectedDepositAssets={setSelectedDepositAssets}
          />
          <Spacer />
          <MiscFilter categories={selectedMiscFilters} />
          {hasFiltersChanged && (
            <Button
              bg="none"
              borderWidth={2.5}
              borderColor="purple.base"
              borderRadius="1em"
              w="auto"
              fontFamily="Haffer"
              fontSize={12}
              padding="1.75em 2em"
              _hover={{ bg: "purple.dark" }}
              onClick={resetFilters}
              leftIcon={<Text fontSize={"1.25em"}>Reset</Text>}
              rightIcon={<DeleteCircleIcon boxSize={4} />}
            />
          )}
        </HStack>
      )}
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
            <StrategyTable columns={columns} data={strategyData} />
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
          </>
        )}
      </TransparentSkeleton>
    </LayoutWithSidebar>
  )
}
