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
  useBreakpointValue,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react"
import { ChevronDownIcon, CheckIcon } from "components/_icons"
// Revert to image-based icons as requested
import { useSwitchChain, useAccount } from "wagmi"
import { useMemo } from "react"

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Stable fallback: default to Ethereum on first paint
  const DEFAULT_CHAIN = chainConfigMap["ethereum"] || placeholderChain
  const effectiveChain = chainConfigMap[chain.id] || DEFAULT_CHAIN

  const filteredChainKeys = useMemo(() => {
    const chainKeys = Object.keys(chainConfigMap)
    const filteredChainKeys = chainKeys.filter((key) =>
      supportedChains.includes(key)
    )
    return filteredChainKeys
  }, [])

  const handleNetworkChange = async (chainId: string) => {
    try {
      const chainConfig = chainConfigMap[chainId]
      if (!chainConfig) {
        throw new Error("Unsupported chain")
      }

      await switchChainAsync({ chainId: chainConfig.wagmiId })
      onChainChange && onChainChange(chainId)
      // Close the dropdown and rely on wagmi state to update the label
      onClose()
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
    }
  }

  // Use logoPath images provided by chain config

  return (
    <Popover
      placement="bottom-start"
      isLazy
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          bg="surface.bg"
          borderWidth={2}
          borderColor="purple.base"
          borderRadius="full"
          w="auto"
          fontFamily="Haffer"
          fontSize={12}
          px={3}
          h={"36px"}
          minW="120px"
          _hover={{ bg: "purple.dark" }}
          _active={{ bg: "purple.dark", transform: "translateY(0)" }}
          _focusVisible={{
            boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
          }}
        >
          <HStack
            spacing={2}
            align="center"
            minW={0}
            flexShrink={0}
            data-testid="chain-trigger"
          >
            <Image
              src={effectiveChain.logoPath}
              alt={effectiveChain.displayName}
              boxSize="18px"
              background={"transparent"}
            />
            <Text fontWeight="semibold" whiteSpace="nowrap">
              {effectiveChain.displayName}
            </Text>
            <ChevronDownIcon boxSize="12px" />
          </HStack>
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
        w={{ base: "calc(100vw - 24px)", md: "auto" }}
        boxShadow="0px 12px 24px rgba(0,0,0,0.35)"
        zIndex="dropdown"
        maxW="320px"
      >
        <PopoverBody p={0}>
          <VisuallyHidden aria-live="polite">
            Select network
          </VisuallyHidden>
          <Stack spacing={1}>
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
                  _focusVisible={{
                    boxShadow:
                      "0 0 0 3px var(--chakra-colors-purple-base)",
                  }}
                  role="menuitemradio"
                  aria-checked={
                    supportedChain.id === effectiveChain.id
                  }
                >
                  <HStack spacing={3} align="center">
                    <Image
                      src={supportedChain.logoPath}
                      alt={supportedChain.displayName}
                      boxSize="18px"
                      background={"transparent"}
                    />
                    <Text
                      fontWeight={
                        supportedChain.id === effectiveChain.id
                          ? "bold"
                          : "semibold"
                      }
                    >
                      {supportedChain.displayName}
                    </Text>
                    {supportedChain.id === effectiveChain.id && (
                      <CheckIcon color={"#00C04B"} ml="auto" />
                    )}
                  </HStack>
                </Box>
              )
            })}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ChainButton
