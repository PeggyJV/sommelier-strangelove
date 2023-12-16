import { Button, Center, HStack, Spacer } from "@chakra-ui/react"
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
import { useMemo, useState, useEffect } from "react"
import { InfoBanner } from "components/_banners/InfoBanner"
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

{
  /*
TODOs: 
- Reset button
*/
}

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

  const { timeline } = useHome()
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

  // Always float up "WETH", "USDC", "WBTC", "SOMM", "DAI" to the top of the list in that order for the inital render
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
      (pair) => pair.symbol === "DAI"
    ),
    ...constantAllUniqueAssetsArray.filter(
      (pair) =>
        pair.symbol !== "WETH" &&
        pair.symbol !== "USDC" &&
        pair.symbol !== "WBTC" &&
        pair.symbol !== "SOMM" &&
        pair.symbol !== "DAI"
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

const strategyData = useMemo(() => {
  return (
    data?.filter((item) => {
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
        item?.rewardsApy?.value !== undefined && item?.rewardsApy?.value > 0

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
  )
}, [
  data,
  selectedChainIds,
  selectedDepositAssets,
  showDeprecated,
  showIncentivised,
])

  const loading = isFetching || isRefetching || isLoading
  return (
    <LayoutWithSidebar>
      {
        <div>
          <InfoBanner
            text={
              "A proposal to renew Real Yield BTC incentives is making its way through governance, if it passes rewards will start flowing on Nov 17th."
            }
          />
        </div>
      }
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
      <HStack width="100%" padding={"2em 0em"}>
        <HStack
          spacing={"2em"}
          alignItems="center"
          padding={"2em 0em"}
        >
          <ChainFilter
            {...{
              selectedChainIds,
              setSelectedChainIds,
            }}
          />
          <DepositTokenFilter
            {...{
              constantAllUniqueAssetsArray:
                constantOrderedAllUniqueAssetsArray,
              selectedDepositAssets,
              setSelectedDepositAssets,
            }}
          />
        </HStack>
        <Spacer />
        <HStack
          spacing={"2em"}
          alignItems="right"
          padding={"2em 0em"}
        >
          <MiscFilter
            {...{
              categories: selectedMiscFilters,
            }}
          />
        </HStack>
      </HStack>
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
