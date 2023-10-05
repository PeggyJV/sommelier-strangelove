import { Button, Center, Heading, HStack } from "@chakra-ui/react"
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
import { CellarType } from "data/types"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useMemo, useState } from "react"
import { InfoBanner } from "components/_banners/InfoBanner"
import { analytics } from "utils/analytics"

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
  const [type, setType] = useState<string>("All")
  const strategyType = ["All", "Trading", "Yield"]
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

  const strategyData = useMemo(() => {
    if (type === "Yield") {
      return (
        data?.filter(
          (item) => item?.type === CellarType.yieldStrategies
        ) || []
      )
    }
    if (type === "Trading") {
      return (
        data?.filter(
          (item) => item?.type === CellarType.automatedPortfolio
        ) || []
      )
    }
    return data || []
  }, [data, type])

  const loading = isFetching || isRefetching || isLoading

  return (
    <LayoutWithSidebar>
      {
        <InfoBanner
          text={
            "An incentive proposal for Real Yield BTC is progressing through governance. If it passes additional incentives will commence on October 7th."
          }
        />
      }
      <HStack mb="1.6rem">
        <HStack spacing="8px">
          {strategyType.map((strategy: string, i: number) => {
            const isSelected = strategy === type
            return (
              <Button
                key={i}
                variant="unstyled"
                color="white"
                fontWeight={600}
                fontSize="1rem"
                p={4}
                py={1}
                rounded="100px"
                bg={isSelected ? "surface.primary" : "none"}
                backdropFilter="blur(8px)"
                borderColor={
                  isSelected ? "purple.dark" : "surface.tertiary"
                }
                borderWidth={isSelected ? 1 : 0}
                onClick={() => {
                  // Adding tracking code for each button
                  analytics.track(
                    `strategy.${strategy.toLowerCase()}.selected`,
                    {
                      selectedType: strategy,
                    }
                  )
                  setType(strategy)
                }}
              >
                {strategy}
              </Button>
            )
          })}
        </HStack>
      </HStack>
      <TransparentSkeleton
        height={loading ? "400px" : "auto"}
        w="full"
        borderRadius={20}
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
