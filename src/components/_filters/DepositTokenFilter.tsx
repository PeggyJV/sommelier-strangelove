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
} from "@chakra-ui/react"
import { useState, VFC, useEffect } from "react"
import { ChevronDownIcon } from "components/_icons"

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

export const DepositTokenFilter: VFC<DepositTokenFilterProps> = (
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

  return (
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
              <Text fontSize={"1.25em"}>Deposit Assets</Text>
              <HStack justifyContent={"center"}>
                <AvatarGroup size="sm">
                  {[
                    ...["WETH", "USDC", "WBTC", "SOMM", "DAI"].filter(
                      (symbol) => props.selectedDepositAssets[symbol]
                    ),
                    ...Object.keys(
                      props.selectedDepositAssets
                    ).filter(
                      (symbol) =>
                        ![
                          "WETH",
                          "USDC",
                          "WBTC",
                          "SOMM",
                          "DAI",
                        ].includes(symbol)
                    ),
                  ]
                    .slice(0, 5)
                    .map((symbol) => {
                      const token =
                        props.selectedDepositAssets[symbol]
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
                {Object.keys(props.selectedDepositAssets).length >
                  5 && (
                  <Text fontWeight={600}>
                    +
                    {Object.keys(props.selectedDepositAssets).length -
                      5}
                  </Text>
                )}
              </HStack>
            </HStack>
          }
        />
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
        <PopoverBody p={0}>
          <SimpleGrid columns={2} spacing={3}>
            {Object.values(props.constantAllUniqueAssetsArray).map(
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
                      boxSize="24px"
                    />
                    <Text fontWeight="semibold">{token.symbol}</Text>
                    <Checkbox
                      id={token.symbol}
                      isChecked={checkedStates.get(token.symbol)}
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
