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
  useTheme,
} from "@chakra-ui/react"
import { ChevronDownIcon, CheckIcon } from "components/_icons"
import { VFC } from "react"
import { useSwitchNetwork, useAccount } from "wagmi"

import {
  chainConfigMap,
  supportedChains,
  placeholderChain, // Imported placeholder chain
} from "src/data/chainConfig"
import { useBrandedToast } from "hooks/chakra"

export interface ChainButtonProps {
  chain: Chain
  onChainChange?: (chainId: string) => void
}

const ChainButton: VFC<ChainButtonProps> = ({
  chain,
  onChainChange,
}) => {
  const {
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetworkAsync,
  } = useSwitchNetwork()
  const { isConnected } = useAccount()
  const { addToast, close } = useBrandedToast()

  // Use the chain from props if it exists in chainConfigMap, otherwise use the placeholder
  const effectiveChain = chain
    ? chainConfigMap[chain.id] || placeholderChain
    : placeholderChain

  const chainKeys = Object.keys(chainConfigMap)
  const filteredChainKeys = chainKeys.filter((key) =>
    supportedChains.includes(key)
  )

  const handleNetworkChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let chainId = event.target.value

    try {
      await switchNetworkAsync?.(chainConfigMap[chainId].wagmiId)
      onChainChange && onChainChange(chainId)
      if (isConnected) {
        window.location.reload()
      }
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

  const theme = useTheme()

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          bg="none"
          borderWidth={2}
          borderColor="purple.base"
          borderRadius="full"
          rightIcon={
            <HStack>
              <ChevronDownIcon />
            </HStack>
          }
          w="auto"
          zIndex={401}
          fontFamily="Haffer"
          fontSize={12}
          _hover={{
            bg: "purple.dark",
          }}
          leftIcon={
            <HStack>
              <Image
                src={effectiveChain.logoPath}
                alt={effectiveChain.displayName}
                boxSize="24px"
                background={"transparent"}
              />
              <Text>{effectiveChain.displayName}</Text>
            </HStack>
          }
        />
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
                    handleNetworkChange({
                      target: { value: supportedChain.id },
                    } as any)
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
  )
}

export default ChainButton
