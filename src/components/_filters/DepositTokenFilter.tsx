import {
  Button,
  HStack,
  Image,
  Text,
  SimpleGrid,
  Box,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  AvatarGroup,
  Avatar,
  Checkbox,
  Input,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react"
import { useState, FC, useEffect, ChangeEvent, useMemo } from "react"
import { ChevronDownIcon, DeleteIcon } from "components/_icons"

export type SymbolPathPair = {
  symbol: string
  path: string
}

export interface DepositTokenFilterProps {
  constantAllUniqueAssetsArray: SymbolPathPair[]
  selectedDepositAssets: Record<string, SymbolPathPair>
  setSelectedDepositAssets: (
    depositTokens:
      | Record<string, SymbolPathPair>
      | ((
          prevDepositTokens: Record<string, SymbolPathPair>
        ) => Record<string, SymbolPathPair>)
  ) => void
}

export const DepositTokenFilter: FC<DepositTokenFilterProps> = (
  props
) => {
  const handleTokenClick = (symbol: string) => {
    props.setSelectedDepositAssets((current) => {
      // If all tokens are selected, remove them all from the array expcept for the one that was clicked
      if (
        Object.keys(current).length ===
        props.constantAllUniqueAssetsArray.length
      ) {
        // Toggle all checks off, the one that was clicked will be toggled on in the click handler
        setCheckedStates(
          new Map(
            Object.keys(props.selectedDepositAssets).map((key) => [
              key,
              false,
            ])
          )
        )

        return {
          [symbol]: props.constantAllUniqueAssetsArray.find(
            (token) => token.symbol === symbol
          )!,
        }
      }

      const newTokens = { ...current }
      if (newTokens[symbol]) {
        delete newTokens[symbol]
      } else {
        newTokens[symbol] = props.constantAllUniqueAssetsArray.find(
          (token) => token.symbol === symbol
        )!
      }
      return newTokens
    })
  }

  const toggleCheck = (symbol: string) => {
    setCheckedStates((prev) => {
      const newCheckedStates = new Map(prev)
      newCheckedStates.set(symbol, !newCheckedStates.get(symbol))
      return newCheckedStates
    })
  }

  // Initialize checkedStates based on selectedDepositAssets
  const [checkedStates, setCheckedStates] = useState(
    new Map(
      Object.keys(props.selectedDepositAssets).map((key) => [
        key,
        !!props.selectedDepositAssets[key], // Check if the asset exists in selectedDepositAssets
      ])
    )
  )

  // Synchronize checkedStates with selectedDepositAssets when it changes
  // For reset button 1 level up

  useEffect(() => {
    setCheckedStates(
      new Map(
        Object.keys(props.selectedDepositAssets).map((key) => [
          key,
          !!props.selectedDepositAssets[key], // Update based on current selectedDepositAssets
        ])
      )
    )
  }, [props.selectedDepositAssets])

  const [searchTerm, setSearchTerm] = useState("")

  // Function to handle search input changes
  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value)
  }

  // Filter tokens based on search term
  const filteredTokens = useMemo(
    () =>
      props.constantAllUniqueAssetsArray.filter((token) =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [props.constantAllUniqueAssetsArray, searchTerm]
  )

  const displayedAssets = useMemo(() => {
    const commonTokens = ["WETH", "USDC", "WBTC", "SOMM", "stETH"]
    const selectedCommonTokens = commonTokens.filter(
      (symbol) => props.selectedDepositAssets[symbol]
    )
    const otherSelectedTokens = Object.keys(
      props.selectedDepositAssets
    ).filter((symbol) => !commonTokens.includes(symbol))
    return [...selectedCommonTokens, ...otherSelectedTokens].slice(
      0,
      5
    )
  }, [props.selectedDepositAssets])

  const AssetDisplay = useMemo(
    () => (
      <HStack>
        <Text fontSize={"1.25em"}>Deposit Assets</Text>
        <HStack justifyContent={"center"}>
          <AvatarGroup size="sm">
            {displayedAssets.map((symbol) => {
              const token = props.selectedDepositAssets[symbol]
              return (
                <Avatar
                  name={token.symbol}
                  src={token.path}
                  key={token.symbol}
                  background="transparent"
                  border="none"
                />
              )
            })}
          </AvatarGroup>
          {Object.keys(props.selectedDepositAssets).length > 5 && (
            <Text fontWeight={600}>
              +{Object.keys(props.selectedDepositAssets).length - 5}
            </Text>
          )}
        </HStack>
      </HStack>
    ),
    [displayedAssets, props.selectedDepositAssets]
  )

  // Function to clear search input
  const clearSearch = () => {
    setSearchTerm("")
  }

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
            {AssetDisplay}
            <ChevronDownIcon />
          </HStack>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        p={2}
        maxW="max-content"
        borderWidth={1}
        borderColor="purple.dark"
        borderRadius={"1em"}
        bg="surface.bg"
        fontWeight="semibold"
        _focus={{
          outline: "unset",
          outlineOffset: "unset",
          boxShadow: "unset",
        }}
      >
        <Box pt={4} pb={2} pl={10} width="90%">
          <InputGroup>
            <Input
              placeholder="Search..."
              onChange={handleSearchChange}
              value={searchTerm}
            />
            {searchTerm && (
              <InputRightElement
                onClick={clearSearch}
                cursor="pointer"
              >
                <DeleteIcon color="gray.500" boxSize={".75em"} />
              </InputRightElement>
            )}
          </InputGroup>
        </Box>
        <PopoverBody p={0}>
          <SimpleGrid
            columns={2}
            spacing={3}
            paddingTop=".5em"
            paddingBottom=".5em"
          >
            {Object.values(filteredTokens).map(
              (token: SymbolPathPair) => (
                <Box
                  as="button"
                  key={token.symbol}
                  py={2}
                  px={4}
                  fontSize="sm"
                  borderRadius={6}
                  onClick={() => {
                    handleTokenClick(token.symbol)
                    toggleCheck(token.symbol)
                  }}
                  _hover={{
                    cursor: "pointer",
                    bg: "purple.dark",
                    borderColor: "surface.tertiary",
                  }}
                >
                  <HStack
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    spacing={3}
                  >
                    <Image
                      src={token.path}
                      alt={token.symbol}
                      background="transparent"
                      border="none"
                      boxSize="2em"
                      borderRadius={"50%"}
                    />
                    <Text fontWeight="semibold">{token.symbol}</Text>
                    <Checkbox
                      id={token.symbol}
                      isChecked={
                        checkedStates.get(token.symbol) || false
                      }
                      onChange={(e) => {
                        handleTokenClick(token.symbol)
                        toggleCheck(token.symbol)
                      }}
                    />
                  </HStack>
                </Box>
              )
            )}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
