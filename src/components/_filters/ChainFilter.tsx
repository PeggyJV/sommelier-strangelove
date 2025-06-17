import {
  Button,
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
import { useState, useEffect } from "react"
import {
  chainConfig,
  Chain,
  chainConfigMap,
} from "src/data/chainConfig"
import { ChevronDownIcon } from "components/_icons"

export interface ChainFilterProps {
  selectedChainIds: string[]
  setSelectedChainIds: (
    chainIds: string[] | ((prevChainIds: string[]) => string[])
  ) => void
}

export const ChainFilter = (props: ChainFilterProps) => {
  const handleChainClick = (chainId: string) => {
    props.setSelectedChainIds((current: string[]) => {
      const normalizedChainId = chainId.toLowerCase()

      if (current.includes(normalizedChainId)) {
        // If the chain is already selected, remove it from the array
        return current.filter(
          (id: string) => id !== normalizedChainId
        )
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

  // For reset button 1 level up
  // Syncronize the checked states with the selected chain ids
  useEffect(() => {
    const newCheckedStates = new Map(
      chainConfig.map((chain) => [
        chain.id,
        props.selectedChainIds.includes(chain.id.toLowerCase()),
      ])
    )
    setCheckedStates(newCheckedStates)
  }, [props.selectedChainIds])

  const NetworkDisplay = () => (
    <HStack spacing={2}>
      <Text fontSize={"1.25em"}>Networks</Text>
      <HStack justifyContent={"center"}>
        <AvatarGroup size="sm" dir="reverse">
          {props.selectedChainIds
            .slice(0, 5)
            .map((chainStr: string) => {
              const chain = chainConfigMap[chainStr]
              return (
                <Avatar
                  name={chain.displayName}
                  src={chain.logoPath}
                  key={chain.id}
                  background="transparent"
                  border="none"
                />
              )
            })}
        </AvatarGroup>
        {props.selectedChainIds.length > 5 && (
          <Text fontWeight={600}>
            +{props.selectedChainIds.length - 5}
          </Text>
        )}
      </HStack>
    </HStack>
  )

  return (
    <Popover placement="bottom" isLazy>
      <PopoverTrigger>
        <Button
          bg="none"
          borderWidth={2.5}
          borderColor="purple.base"
          borderRadius="1em"
          w="auto"
          fontFamily="Haffer"
          fontSize={12}
          padding="1.75em 2em"
          _hover={{
            bg: "purple.dark",
          }}
        >
          <HStack>
            <NetworkDisplay />
            <ChevronDownIcon />
          </HStack>
        </Button>
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
                      background="transparent"
                      boxSize="24px"
                    />
                    <Text fontWeight="semibold">
                      {chain.displayName}
                    </Text>{" "}
                    <Checkbox
                      id={chain.id}
                      defaultChecked={true}
                      isChecked={checkedStates.get(chain.id) || false}
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
  )
}
