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
import { getTokenConfig, Token } from "data/tokenConfig"
import { useFormContext } from "react-hook-form"
import { toEther } from "utils/formatCurrency"
import { ModalMenuProps } from "."
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { depositAssetDefaultValue } from "data/uiConfig"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"

export interface ModalOnlyTokenMenuProps {
  depositTokens: string[]
  setSelectedToken: (value: any) => void
  activeAsset?: string
  isDisabled?: boolean
}

export interface MenuOnlyTokenProps
  extends Omit<ModalOnlyTokenMenuProps, "setSelectedToken"> {
  value: Token
  onChange: (...events: any[]) => void
}

export const OnlyTokenMenu: VFC<MenuOnlyTokenProps> = ({
  depositTokens,
  activeAsset,
  value,
  onChange,
}) => {
  const { colors } = useTheme()
  const menuRef = useRef(null)
  const { register, setValue, clearErrors } = useFormContext()

  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config

  const depositTokenConfig = getTokenConfig(
    depositTokens,
    cellarConfig.chain.id
  ) as Token[]

  return (
    <HStack
      ref={menuRef}
      p={4}
      justifyContent="space-between"
      w="auto"
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
      {/* @ts-ignore using string where number is expected. This is to ensure popover is always placed at the top of button, no matter the height value. */}
      <ChMenu placement="bottom">
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
                <Image boxSize={5} src={value.src} alt={value.alt} borderRadius="50%"/>
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
          w={"50%"}
        >
          <MenuOptionGroup
            defaultValue={
              activeAsset && depositAssetDefaultValue(cellarConfig)
            }
            type="radio"
          >
            <Box pt={4} pb={2} pl={10}>
              <Text color="neutral.400">Select withdraw asset</Text>
            </Box>
            {depositTokenConfig.map((token) => {
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
                      <Image boxSize={5} src={src} alt={alt} borderRadius="50%"/>
                      <span>{symbol}</span>
                    </HStack>
                  </HStack>
                </MenuItemOption>
              )
            })}
          </MenuOptionGroup>
        </MenuList>
      </ChMenu>
    </HStack>
  )
}
