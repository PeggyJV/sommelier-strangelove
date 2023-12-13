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
import { useState, VFC } from "react"
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

  const [checkedStates, setCheckedStates] = useState(
    new Map(
      Object.keys(props.selectedDepositAssets).map((key) => [
        key,
        true,
      ])
    )
  )

  const toggleCheck = (symbol: string) => {
    setCheckedStates((prev) => {
      const newCheckedStates = new Map(prev)
      newCheckedStates.set(symbol, !newCheckedStates.get(symbol))
      return newCheckedStates
    })
  }

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
                  {Object.values(props.selectedDepositAssets)
                    .slice(0, 5)
                    .map((token: SymbolPathPair) => (
                      <Avatar
                        
                        name={token.symbol}
                        src={token.path}
                        key={token.symbol}
                        background="transparent"
                      />
                    ))}
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
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
