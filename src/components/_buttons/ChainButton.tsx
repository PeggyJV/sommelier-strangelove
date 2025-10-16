import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  Stack,
  Text,
  HStack,
  Box,
  Image,
  Tooltip,
  Spinner,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react"
import { CheckIcon, ChevronDownIcon } from "components/_icons"
import { useSwitchChain, useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useMemo, useState } from "react"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

import {
  chainConfigMap,
  supportedChains,
  placeholderChain,
  Chain,
} from "src/data/chainConfig"
import { useBrandedToast } from "hooks/chakra"

export interface ChainButtonProps {
  chain?: Chain
  onChainChange?: (chainId: string) => void
}

const ChainButton = ({
  chain = placeholderChain,
  onChainChange,
}: ChainButtonProps) => {
  const { switchChainAsync } = useSwitchChain()
  const { isConnected } = useAccount()
  const { addToast, close } = useBrandedToast()
  const { openConnectModal } = useConnectModal()
  const isMobile = !useBetterMediaQuery("(min-width: 768px)")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const effectiveChain = chainConfigMap[chain.id] || placeholderChain

  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)

  const filteredChainKeys = useMemo(() => {
    const chainKeys = Object.keys(chainConfigMap)
    const filteredChainKeys = chainKeys.filter((key) =>
      supportedChains.includes(key)
    )
    return filteredChainKeys
  }, [])

  const handleNetworkChange = async (chainId: string) => {
    try {
      setIsSwitchingNetwork(true)
      const chainConfig = chainConfigMap[chainId]
      if (!chainConfig) {
        throw new Error("Unsupported chain")
      }

      await switchChainAsync({ chainId: chainConfig.wagmiId })
      if (onChainChange) onChainChange(chainId)
    } catch (e) {
      const error = e as Error
      console.error("Failed to switch the network: ", error?.message)
      addToast({
        heading: "Error switching network",
        status: "error",
        body: <Text>{error?.message}</Text>,
        closeHandler: close,
        duration: null,
      })
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  if (!isConnected) {
    return (
      <Tooltip
        hasArrow
        label="Connect wallet to switch network"
        placement="bottom"
        bg="surface.bg"
        color="neutral.300"
        textAlign="center"
      >
        <Button
          onClick={() => openConnectModal?.()}
          aria-disabled
          title="Connect wallet to switch network"
          variant="sommOutline"
          borderRadius="full"
          w="auto"
          minH="48px"
          pl={{ base: 4, md: 6 }}
          pr={{ base: 4, md: 12 }}
          minW={{ base: "auto", md: "176px" }}
          zIndex={401}
          position="relative"
          cursor="not-allowed"
          _hover={{ bg: "purple.dark" }}
          _focusVisible={{ boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)" }}
        >
          <HStack spacing={2} align="center" justify="center" maxW="100%">
            <Image src={effectiveChain.logoPath} alt={effectiveChain.displayName} boxSize="24px" background={"transparent"} />
            <Text whiteSpace="nowrap" isTruncated>
              {effectiveChain.displayName}
            </Text>
          </HStack>
          <Box position="absolute" right={7}>
            <ChevronDownIcon />
          </Box>
        </Button>
      </Tooltip>
    )
  }

  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant="sommOutline"
            borderRadius="full"
            minH="44px"
            px={4}
            zIndex={401}
            position="relative"
            pointerEvents={isSwitchingNetwork ? "none" : undefined}
            title={
              isSwitchingNetwork
                ? "Switching network… Confirm in your wallet"
                : undefined
            }
            _hover={{ bg: "purple.dark" }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
            }}
            onClick={onOpen}
          >
            <HStack
              spacing={2}
              align="center"
              justify="space-between"
              maxW="100%"
              w="full"
            >
              <HStack spacing={2} minW={0}>
                <Image
                  src={effectiveChain.logoPath}
                  alt={effectiveChain.displayName}
                  boxSize="20px"
                  background={"transparent"}
                />
                <Text whiteSpace="nowrap" isTruncated>
                  {effectiveChain.displayName}
                </Text>
              </HStack>
              {isSwitchingNetwork ? (
                <Spinner size="xs" />
              ) : (
                <ChevronDownIcon />
              )}
            </HStack>
          </Button>

          <Drawer
            placement="bottom"
            onClose={onClose}
            isOpen={isOpen}
          >
            <DrawerOverlay />
            <DrawerContent bg="surface.bg" borderTopRadius={16}>
              <DrawerHeader
                borderBottomWidth="1px"
                borderColor="surface.tertiary"
              >
                Select network
              </DrawerHeader>
              <DrawerBody>
                <Stack spacing={2}>
                  {filteredChainKeys.map((chainKey) => {
                    const supportedChain = chainConfigMap[chainKey]
                    return (
                      <Button
                        key={supportedChain.id}
                        onClick={async () => {
                          await handleNetworkChange(supportedChain.id)
                          onClose()
                        }}
                        justifyContent="flex-start"
                        variant="ghost"
                        height="48px"
                        _hover={{ bg: "purple.dark" }}
                      >
                        <HStack w="full" justify="space-between">
                          <HStack>
                            <Image
                              src={supportedChain.logoPath}
                              alt={supportedChain.displayName}
                              boxSize="24px"
                              background={"transparent"}
                            />
                            <Text fontWeight="semibold">
                              {supportedChain.displayName}
                            </Text>
                          </HStack>
                          {supportedChain.id ===
                            effectiveChain.id && (
                            <CheckIcon color={"#00C04B"} />
                          )}
                        </HStack>
                      </Button>
                    )
                  })}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Popover placement="bottom" isLazy>
          <PopoverTrigger>
            <Button
              variant="sommOutline"
              borderRadius="full"
              w="auto"
              minH="48px"
              pl={{ base: 4, md: 6 }}
              pr={{ base: 6, md: 14 }}
              minW={{ base: "auto", md: "176px" }}
              zIndex={401}
              position="relative"
              pointerEvents={isSwitchingNetwork ? "none" : undefined}
              title={
                isSwitchingNetwork
                  ? "Switching network… Confirm in your wallet"
                  : undefined
              }
              _hover={{ bg: "purple.dark" }}
              _focusVisible={{
                boxShadow:
                  "0 0 0 3px var(--chakra-colors-purple-base)",
              }}
            >
              <HStack
                spacing={2}
                align="center"
                justify="center"
                maxW="100%"
              >
                <Image
                  src={effectiveChain.logoPath}
                  alt={effectiveChain.displayName}
                  boxSize="24px"
                  background={"transparent"}
                />
                <Text whiteSpace="nowrap">
                  {effectiveChain.displayName}
                </Text>
              </HStack>
              <Box position="absolute" right={7}>
                {isSwitchingNetwork ? (
                  <Spinner size="xs" />
                ) : (
                  <ChevronDownIcon />
                )}
              </Box>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            p={2}
            maxW="max-content"
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
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
                {filteredChainKeys.map((chainKey) => {
                  const supportedChain = chainConfigMap[chainKey]
                  return (
                    <Box
                      as="button"
                      key={supportedChain.id}
                      py={2}
                      px={4}
                      fontSize="sm"
                      borderRadius={6}
                      onClick={() =>
                        handleNetworkChange(supportedChain.id)
                      }
                      _hover={{
                        cursor: "pointer",
                        bg: "purple.dark",
                        borderColor: "surface.tertiary",
                      }}
                    >
                      <HStack>
                        <Image
                          src={supportedChain.logoPath}
                          alt={supportedChain.displayName}
                          boxSize="24px"
                          background={"transparent"}
                        />
                        <Text fontWeight="semibold">
                          {supportedChain.displayName}
                        </Text>
                        {supportedChain.id === effectiveChain.id && (
                          <CheckIcon color={"#00C04B"} />
                        )}
                      </HStack>
                    </Box>
                  )
                })}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default ChainButton
