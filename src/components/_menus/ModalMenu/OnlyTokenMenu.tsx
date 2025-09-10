import {
  Box,
  HStack,
  Icon,
  Image,
  Menu as ChMenu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import { FaChevronDown } from "react-icons/fa"
import { getTokenConfig, Token } from "data/tokenConfig"
import { useFormContext } from "react-hook-form"
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
  isDisabled?: boolean
}

export const OnlyTokenMenu = ({
  depositTokens,
  activeAsset,
  value,
  onChange,
  isDisabled,
}: MenuOnlyTokenProps) => {
  const menuRef = useRef(null)
  const { clearErrors } = useFormContext()

  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config

  const depositTokenConfig = getTokenConfig(
    depositTokens,
    cellarConfig.chain.id
  ) as Token[]

  // Avoid setState during render: set default selected token once when ready
  useEffect(() => {
    if (!value && activeAsset) {
      const def = depositTokenConfig.find(
        (t) => t.address.toUpperCase() === activeAsset.toUpperCase()
      )
      if (def) onChange(def)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, activeAsset, depositTokenConfig])

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
          disabled={isDisabled}
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

              return (
                <MenuItemOption
                  key={address}
                  value={symbol}
                  borderRadius={8}
                  _hover={{ bg: "rgba(96, 80, 155, 0.4)" }}
                  disabled={isDisabled}
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
