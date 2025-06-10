import {
  Button,
  Center,
  Heading,
  HStack,
  Link,
  Spacer,
  Text,
  VStack,
  Image,
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
import { DeleteCircleIcon } from "components/_icons"
import { add, isBefore } from "date-fns"
import { useAccount } from "wagmi"
import { StrategyData } from "data/actions/types"
import { useUserBalances } from "data/hooks/useUserBalances"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { MigrationModal } from "components/_modals/MigrationModal"

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

  const { isConnected } = useAccount();
  const { userBalances } = useUserBalances();

  const columns = isDesktop
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
      !(JSON.stringify(selectedChainIds) !== JSON.stringify(initialChainIds)) ||
      !(JSON.stringify(selectedDepositAssets) !== JSON.stringify(initialDepositAssets)) ||
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
        Number(item?.rewardsApy?.value) > 0

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

      // 1. Priority - strategies deposit assets that user holds
      if (isConnected && userBalances.data) {
        for (const balance of userBalances.data) {
          const doesStrategyHaveAsset = (strategy: StrategyData) => strategy?.depositTokens?.some(
            asset => {
              // if user has ETH consider it as they had WETH
              if (balance.symbol.toUpperCase() === "ETH" && asset.toUpperCase() === "WETH") {
                return true;
              }
               return asset.toUpperCase() === balance.symbol.toUpperCase()
            }
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
      //if ((a?.rewardsApy || b?.rewardsApy) && !(a?.rewardsApy && b?.rewardsApy)) {
        //return a?.rewardsApy ? -1 : 1;
      //}

      // 4. Priority - TVL
      return parseFloat(b?.tvm?.value ?? '') - parseFloat(a?.tvm?.value ?? '');
    });
  }, [
    data,
    selectedChainIds,
    selectedDepositAssets,
    showDeprecated,
    showIncentivised,
    userBalances.data,
    isConnected
  ])

  const loading = isFetching || isRefetching || isLoading
  return (
    <LayoutWithSidebar>
      {/*
        <InfoBanner
          text={
            "A new SOMM incentive proposal for Real Yield ETH on Arbitrum is progressing through governance. If it passes, rewards will begin on March 17."
            "New incentive programs for Real Yield ETH (on Ethereum) Real Yield BTC and Real Yield USD (on Arbitrum) are progressing through governance. If they pass, rewards will begin flowing on March 24"
          }
        />
      }
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
        <VStack
          p={4}
          mb={6}
          spacing={4}
          align="center"
          justify="center"
        >
          <VStack align="center" justify="center" w="100%">
            <Heading textAlign="center">
              GGV - Make stETH Great Again
            </Heading>
            <Text textAlign="center">
              A dynamic strategy to optimize yield thorugh AL-enhanced
              staking and automated DeFi strategies.
            </Text>
          </VStack>
          <VStack align="center" justify="center">
            <Link
              href="https://sommelier-web-git-boringvault-integration-sommelierfinance.vercel.app/strategies/Alpha-stETH/manage"
              textDecoration="none"
            >
              <SecondaryButton
                fontSize="md"
                px={4}
                py={2}
                h="50px"
                textDecoration="none"
              >
                Explore Vault
              </SecondaryButton>
            </Link>
          </VStack>
          <VStack align="center" justify="center">
            <Image
              src="/assets/images/eth-lido-uni-2.png"
              alt="Alpha stETH"
            />
          </VStack>
        </VStack>
      ) : (
        <HStack
          p={4}
          mb={6}
          spacing={4}
          align="center"
          justify="space-evenly"
        >
          <VStack align="center" justify="center" w="30%">
            <Heading textAlign="center">
              GGV - Make stETH Great Again
            </Heading>
            <Text textAlign="center">
              A dynamic strategy to optimize yield thorugh AL-enhanced
              staking and automated DeFi strategies.
            </Text>
          </VStack>
          <VStack align="center" justify="center">
            <Link
              href="https://sommelier-web-git-boringvault-integration-sommelierfinance.vercel.app/strategies/Alpha-stETH/manage"
              textDecoration="none"
            >
              <SecondaryButton
                fontSize="md"
                px={4}
                py={2}
                h="50px"
                textDecoration="none"
              >
                Explore Vault
              </SecondaryButton>
            </Link>
          </VStack>
          <VStack align="center" justify="center">
            <Image
              src="/assets/images/eth-lido-uni-2.png"
              alt="Alpha stETH"
            />
          </VStack>
        </HStack>
      )}
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
            >
              <HStack>
                <Text fontSize={"1.25em"}>Reset</Text>
                <DeleteCircleIcon boxSize={4} />
              </HStack>
            </Button>
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
            >
              <HStack>
                <Text fontSize={"1.25em"}>Reset</Text>
                <DeleteCircleIcon boxSize={4} />
              </HStack>
            </Button>
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
