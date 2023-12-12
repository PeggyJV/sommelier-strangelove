import { Button, Center, HStack, Image, Text } from "@chakra-ui/react"
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
import { chainConfig, Chain } from "src/data/chainConfig"

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

  const allChainIds = chainConfig.map((chain) => chain.id)
  const [selectedChainIds, setSelectedChainIds] =
    useState<string[]>(allChainIds)

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

  const handleChainClick = (chainId: string) => {
    setSelectedChainIds(
      (current) =>
        current.includes(chainId)
          ? current.filter((id) => id !== chainId) // Remove if already selected
          : [...current, chainId] // Add if not selected
    )
  }

  const strategyData = useMemo(() => {
    return (
      data?.filter((item) =>
        selectedChainIds.includes(item?.config.chain.id!)
      ) || []
    )
  }, [data, selectedChainIds])

  const loading = isFetching || isRefetching || isLoading
  return (
    <LayoutWithSidebar>
      {
        <InfoBanner
          text={
            "A proposal to renew Real Yield BTC incentives is making its way through governance, if it passes rewards will start flowing on Nov 17th."
          }
        />
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
      <HStack mb="1.6rem">
        <HStack spacing="8px">
          {chainConfig.map((chain: Chain) => {
            const isSelected = selectedChainIds.includes(chain.id)
            return (
              <Button
                key={chain.id}
                variant="solid"
                color="white"
                fontWeight={600}
                fontSize="1rem"
                p={4}
                py={1}
                rounded="100px"
                bg={
                  isSelected ? "gradient.primary" : "surface.primary"
                }
                //backdropFilter="blur(8px)"
                borderColor="purple.base"
                borderWidth={2}
                onClick={() => handleChainClick(chain.id)}
              >
                <HStack spacing={1}>
                  <Image
                    src={chain.logoPath}
                    alt={chain.alt}
                    boxSize="1.5rem"
                    mr={2}
                  />
                  <Text>
                    {chain.id.slice(0, 1).toUpperCase() +
                      chain.id.slice(1)}
                  </Text>
                </HStack>
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
