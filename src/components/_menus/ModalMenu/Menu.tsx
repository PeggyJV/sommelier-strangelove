import {
  Box,
  Button,
  HStack,
  VStack,
  Icon,
  Image,
  Input,
  Menu as ChMenu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useDimensions,
  useTheme,
} from "@chakra-ui/react"
import { useRef, VFC, useState, useEffect, ChangeEvent } from "react"
import { FaChevronDown } from "react-icons/fa"
import { getTokenConfig, Token } from "data/tokenConfig"
import { useFormContext } from "react-hook-form"
import { toEther } from "utils/formatCurrency"
import { ModalMenuProps } from "."
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { ActiveAssetIcon } from "components/_icons"

export interface MenuProps
  extends Omit<ModalMenuProps, "setSelectedToken"> {
  value: Token
  onChange: (...events: any[]) => void
}

export const Menu: VFC<MenuProps> = ({
  depositTokens,
  activeAsset,
  selectedTokenBalance,
  value,
  onChange,
}) => {
  const { colors } = useTheme()
  const menuRef = useRef(null)
  const menuDims = useDimensions(menuRef, true)
  const { register, setValue, clearErrors, watch } = useFormContext()
  const availableBalance = `${toEther(
    selectedTokenBalance?.value,
    selectedTokenBalance?.decimals,
    false,
    6
  )}`
  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config

  const rawDepositAmount = watch("depositAmount")
  const depositTokenConfig = getTokenConfig(depositTokens) as Token[]
  const [selectedToken, setSelectedToken] = useState<
    Token | undefined
  >(depositTokenConfig[0]) // First one is always active asset

  const setMax = () => {
    // analytics.track("deposit.max-selected", {
    //   value: selectedTokenBalance?.value?.toString(),
    // })

    return setValue(
      "depositAmount",
      parseFloat(
        toEther(
          selectedTokenBalance?.value,
          selectedTokenBalance?.decimals,
          false,
          6
        )
      )
    )
  }
  const [displayedBalance, setDisplayedBalance] = useState(0)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false) // TODO: if coingecko ends up being kinda slow use this to render loading icon
  useEffect(() => {
    const fetchAndUpdateBalance = async () => {
      if (rawDepositAmount) {
        setIsLoadingPrice(true) // Start the loading state

        try {
          const price = await fetchCoingeckoPrice(
            selectedToken!.coinGeckoId,
            "usd"
          )
          console.log("price", price)
          const newBalance = rawDepositAmount * Number(price || 0)
          setDisplayedBalance(newBalance)
        } catch (error) {
          console.error("Error fetching price:", error)
        }

        setIsLoadingPrice(false) // End the loading state
      } else {
        setDisplayedBalance(0)
      }
    }

    fetchAndUpdateBalance()
  }, [rawDepositAmount])

  const [searchTerm, setSearchTerm] = useState("")

  // Function to handle search input changes
  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  // Filter tokens based on search term
  const filteredTokens = depositTokenConfig.filter((token) =>
    token.symbol.toLowerCase().includes(searchTerm)
  )

  return (
    <HStack
      ref={menuRef}
      p={4}
      justifyContent="space-between"
      w="100%"
      bg="surface.secondary"
      border="none"
      borderRadius={16}
      appearance="none"
      textAlign="start"
      _first={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <VStack w="100%" spacing={0} align="flex-start">
        {/* @ts-ignore using string where number is expected. This is to ensure popover is always placed at the top of button, no matter the height value. */}
        <ChMenu offset={["10%", "100%"]} placement="bottom">
          <MenuButton
            as={Box}
            border="none"
            borderRadius={16}
            appearance="none"
            fontSize="lg"
            fontWeight={700}
          >
            <HStack>
              {value ? (
                <HStack spacing={1}>
                  <Image
                    boxSize={5}
                    src={value.src}
                    alt={value.alt}
                  />
                  <span>{value.symbol}</span>
                </HStack>
              ) : (
                <Text as="span">Select Token</Text>
              )}
              {depositTokens.length > 1 && (
                <Icon as={FaChevronDown} />
              )}
            </HStack>
          </MenuButton>
          <MenuList
            bg="surface.bg"
            borderColor="purple.base"
            borderRadius={16}
            zIndex="overlay"
            boxShadow={`0 2px 24px 0 ${colors.surface.tertiary}`}
            w={menuDims?.borderBox.width}
            maxH="30em"
            overflowY="auto"
            scrollBehavior="smooth"
          >
            <Box pt={4} pb={2} pl={10} width="90%">
              <Input
                placeholder="Select Deposit Asset"
                onChange={handleSearchChange}
                value={searchTerm}
              />
            </Box>
            <MenuOptionGroup
              defaultValue={depositTokenConfig[0].symbol}
              type="radio"
            >
              {" "}
              {/*
              <Box pt={4} pb={2} pl={10}>
                <Text color="neutral.400">Select deposit asset</Text>
              </Box>*/}
              {filteredTokens.map((token) => {
                const { address, src, alt, symbol } = token
                const isActiveAsset =
                  token.address.toUpperCase() ===
                  activeAsset?.toUpperCase()

                // Set default selected token to active asset.
                if (isActiveAsset && !value) onChange(token)

                return (
                  <MenuItemOption
                    key={address}
                    value={symbol}
                    borderRadius={8}
                    _hover={{ bg: "rgba(96, 80, 155, 0.4)" }}
                    onClick={() => {
                      clearErrors()
                      onChange(token)
                      setSelectedToken(token)
                      setDisplayedBalance(0)
                      setValue("depositAmount", 0)
                    }}
                  >
                    <HStack justify="space-between">
                      <HStack width="100%">
                        <Image boxSize={5} src={src} alt={alt} />
                        <span>{symbol}</span>
                        {isActiveAsset && (
                          <HStack
                            justifyItems={"right"}
                            width="100%"
                            justifyContent="flex-end"
                            alignItems="flex-start"
                            p={3}
                          >
                            <ActiveAssetIcon
                              boxSize={5}
                              alignSelf="center"
                            />
                            <Text fontSize="xs" fontWeight={600}>
                              Base asset
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                    </HStack>
                  </MenuItemOption>
                )
              })}
            </MenuOptionGroup>
          </MenuList>
        </ChMenu>
        <HStack spacing={0} fontSize="10px" paddingTop="0.75em">
          <Text as="span">Available: {availableBalance}</Text>
          <Button
            variant="unstyled"
            p={0}
            w="max-content"
            h="max-content"
            textTransform="uppercase"
            onClick={setMax}
            fontSize="inherit"
            fontWeight={600}
          >
            max
          </Button>
        </HStack>
      </VStack>
      <VStack spacing={0} align="flex-end">
        <Input
          variant="unstyled"
          pr="2"
          type="number"
          step="any"
          defaultValue="0.00"
          placeholder="0.00"
          fontSize="lg"
          fontWeight={700}
          textAlign="right"
          width="100%"
          {...register("depositAmount", {
            onChange: (event) => {
              if (event && event.target) {
                // analytics.track("deposit.amount-selected", {
                //   value: event.target.value,
                // })
              }
            },
            required: "Enter amount",
            valueAsNumber: true,
            validate: {
              positive: (v) =>
                v > 0 || "You must submit a positive amount.",
              lessThanBalance: (v) => {
                return (
                  v <= parseFloat(availableBalance) ||
                  "Insufficient balance"
                )
              },
              // depositLessThanFifty: (v) =>
              //   v <= 50000 ||
              //   "You cannot exceed the cellar limit of $50,000.",
              // depositLimit: (v) => {
              //   if (!depositData?.wallet) return true

              //   const currentDeposits = parseFloat(
              //     toEther(
              //       depositData?.wallet?.currentDeposits!,
              //       18,
              //       false
              //     )
              //   )
              //   const sum = v + currentDeposits

              //   return (
              //     sum <= 50000 ||
              //     `You cannot exceed the cellar limit of $50,000. You currently have $${currentDeposits} deposited in this cellar.`
              //   )
              // },
            },
          })}
        />
        <HStack spacing={0} fontSize="11px" textAlign="right" pr="2">
          <Text as="span">
            $ {Number(displayedBalance.toFixed(2)).toLocaleString()}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  )
}
