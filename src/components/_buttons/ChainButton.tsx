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
  Select,
  useTheme,
} from "@chakra-ui/react"
import { ChevronDownIcon, CheckIcon} from "components/_icons"
import { VFC } from "react"

import {
  chainConfigMap,
  supportedChains,
  chainConfig,
  Chain,
} from "src/data/chainConfig"

export interface ChainButtonProps {
  chain: Chain
  onChainChange?: (chainId: string) => void
}

const ChainButton: VFC<ChainButtonProps> = ({
  chain,
  onChainChange,
}) => {
  const handleNetworkChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChainChange && onChainChange(event.target.value)
  }
  const chainKeys = Object.keys(chainConfigMap)
  const filteredChainKeys = chainKeys.filter((key) =>
    supportedChains.includes(key)
  )

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
                src={chain.logoPath}
                alt={chain.displayName}
                boxSize="24px"
              />
              <Text>{chain.displayName}</Text>
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
                    />
                    <Text fontWeight="semibold">
                      {supportedChain.displayName}
                    </Text>
                    {supportedChain.id === chain.id && (
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
