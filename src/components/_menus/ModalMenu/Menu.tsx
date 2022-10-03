import {
  Box,
  Button,
  HStack,
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
  VStack,
} from "@chakra-ui/react"
import { useRef, VFC } from "react"
import { FaChevronDown } from "react-icons/fa"
import { depositAssetTokenConfig, Token } from "data/tokenConfig"
import { useFormContext } from "react-hook-form"
import { toEther } from "utils/formatCurrency"
import { ModalMenuProps } from "."
import { analytics } from "utils/analytics"
import { useGetCurrentDepositsQuery } from "generated/subgraph"
import { useAccount } from "wagmi"

export interface MenuProps
  extends Omit<ModalMenuProps, "setSelectedToken"> {
  value: Token
  onChange: (...events: any[]) => void
}

export const Menu: VFC<MenuProps> = ({
  activeAsset,
  selectedTokenBalance,
  value,
  onChange,
}) => {
  const { address } = useAccount()
  const [{ data: depositData }] = useGetCurrentDepositsQuery({
    variables: { walletAddress: address?.toLowerCase()! },
  })
  const { colors } = useTheme()
  const menuRef = useRef(null)
  const menuDims = useDimensions(menuRef, true)
  const { register, setValue, clearErrors } = useFormContext()
  const availableBalance = `${toEther(
    selectedTokenBalance?.value,
    selectedTokenBalance?.decimals
  )}`
  const setMax = () => {
    analytics.track("deposit.max-selected", {
      value: selectedTokenBalance?.value?.toString(),
    })

    return setValue(
      "depositAmount",
      parseFloat(
        toEther(
          selectedTokenBalance?.value,
          selectedTokenBalance?.decimals,
          false
        )
      )
    )
  }

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
      css={{
        "span:first-of-type": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
    >
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
                <Image boxSize={5} src={value.src} alt={value.alt} />
                <span>{value.symbol}</span>
              </HStack>
            ) : (
              <Text as="span">Select Token</Text>
            )}
            <Icon as={FaChevronDown} />
          </HStack>
        </MenuButton>
        <MenuList
          bg="surface.bg"
          borderColor="purple.base"
          borderRadius={16}
          zIndex="overlay"
          boxShadow={`0 2px 24px 0 ${colors.surface.tertiary}`}
          w={menuDims?.borderBox.width}
        >
          <MenuOptionGroup
            defaultValue={
              activeAsset && depositAssetTokenConfig[0].symbol
            }
            type="radio"
          >
            <Box pt={4} pb={2} pl={10}>
              <Text color="neutral.400">Select deposit asset</Text>
            </Box>
            {depositAssetTokenConfig.map((token) => {
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
                  }}
                >
                  <HStack justify="space-between">
                    <HStack>
                      <Image boxSize={5} src={src} alt={alt} />
                      <span>{symbol}</span>
                    </HStack>
                    {isActiveAsset && (
                      <Text as="span">Active Asset</Text>
                    )}
                  </HStack>
                </MenuItemOption>
              )
            })}
          </MenuOptionGroup>
        </MenuList>
      </ChMenu>
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
          {...register("depositAmount", {
            onChange: (event) => {
              if (event && event.target) {
                analytics.track("deposit.amount-selected", {
                  value: event.target.value,
                })
              }
            },
            required: "Enter amount",
            valueAsNumber: true,
            validate: {
              positive: (v) =>
                v > 0 || "You must submit a positive amount.",
              lessThanBalance: (v) => {
                return (
                  v <=
                    parseFloat(
                      toEther(
                        selectedTokenBalance?.value || "",
                        selectedTokenBalance?.decimals,
                        false
                      )
                    ) || "Insufficient balance"
                )
              },
            },
          })}
        />
        <HStack spacing={0} fontSize="10px">
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
    </HStack>
  )
}
