import {
  Button,
  Center,
  HStack,
  Image,
  Text,
  Stack,
  Box,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  AvatarGroup,
  Avatar,
  Checkbox,
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
import { InfoBanner } from "components/_banners/InfoBanner"
import {
  chainConfig,
  Chain,
  chainConfigMap,
} from "src/data/chainConfig"
import { ChevronDownIcon } from "components/_icons"

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
    setSelectedChainIds((current) => {
      const normalizedChainId = chainId.toLowerCase()

      if (current.includes(normalizedChainId)) {
        // If the chain is already selected, remove it from the array
        return current.filter((id) => id !== normalizedChainId)
      } else {
        // If the chain is not selected, add it to the array
        return [...current, normalizedChainId]
      }
    })
  }

  const [checkedStates, setCheckedStates] = useState(
    new Map(chainConfig.map((chain) => [chain.id, true])) // Default all chains to checked
  )

  const toggleCheck = (id: string) => {
    setCheckedStates((prev) => {
      const newCheckedStates = new Map(prev)
      newCheckedStates.set(
        id.toLowerCase(),
        !newCheckedStates.get(id.toLowerCase())
      )
      return newCheckedStates
    })
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
      <HStack mb="1.6rem">
        <HStack spacing="8px">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                bg="none"
                borderWidth={2.5}
                borderColor="purple.base"
                borderRadius="1em"
                rightIcon={<ChevronDownIcon />}
                w="auto"
                zIndex={401}
                fontFamily="Haffer"
                fontSize={12}
                padding="1.75em 2em"
                _hover={{
                  bg: "purple.dark",
                }}
                leftIcon={
                  <HStack>
                    <Text fontSize={"1.25em"}>Networks</Text>
                    <HStack justifyContent={"center"}>
                      <AvatarGroup size="sm" dir="reverse">
                        {selectedChainIds
                          .slice(0, 5)
                          .map((chainStr: String) => {
                            const chain =
                              chainConfigMap[chainStr.toLowerCase()]
                            return (
                              <Avatar
                                name={chain.displayName}
                                src={chain.logoPath}
                                key={chain.id}
                              />
                            )
                          })}
                      </AvatarGroup>
                      {selectedChainIds.length > 5 && (
                        <Text fontWeight={600}>
                          +{selectedChainIds.length - 5}
                        </Text>
                      )}
                    </HStack>
                    {selectedChainIds.length > 5 && (
                      <Text fontSize="sm">
                        +{selectedChainIds.length - 5}
                      </Text>
                    )}
                  </HStack>
                }
              />
            </PopoverTrigger>

            <PopoverContent
              p={2}
              maxW="max-content"
              borderWidth={1}
              borderColor="purple.dark"
              borderRadius={2}
              bg="surface.bg"
              fontWeight="semibold"
              _focus={{
                outline: "unset",
                outlineOffset: "unset",
                boxShadow: "unset",
              }}
            >
              <PopoverBody p={0}>
                <Stack>
                  {chainConfig.map((chain: Chain) => {
                    const isSelected = selectedChainIds.includes(
                      chain.id
                    )
                    return (
                      <Box
                        as="button"
                        key={chain.id}
                        py={2}
                        px={4}
                        fontSize="sm"
                        borderRadius={6}
                        onClick={() => {
                          handleChainClick(chain.id)
                          toggleCheck(chain.id)
                        }}
                        _hover={{
                          cursor: "pointer",
                          bg: "purple.dark",
                          borderColor: "surface.tertiary",
                        }}
                      >
                        <HStack
                          display="flex" // Use flex display
                          justifyContent="space-between" // Space between items
                          alignItems="center" // Align items vertically
                          width="100%" // Full width
                          spacing={3}
                        >
                          <Image
                            src={chain.logoPath}
                            alt={chain.displayName}
                            boxSize="24px"
                          />
                          <Text fontWeight="semibold">
                            {chain.displayName}
                          </Text>{" "}
                          <Checkbox
                            id={chain.id}
                            defaultChecked={true}
                            isChecked={checkedStates.get(chain.id)}
                            onChange={(e) => {
                              handleChainClick(chain.id)
                              toggleCheck(chain.id)
                            }}
                          />
                        </HStack>
                      </Box>
                    )
                  })}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
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
