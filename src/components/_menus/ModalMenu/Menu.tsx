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
} from "@chakra-ui/react"
import { VFC } from "react"
import { FaChevronDown } from "react-icons/fa"
import { Token, tokenConfig } from "data/tokenConfig"

interface MenuProps {
  value: Token
  onChange: (...events: any[]) => void
}

export const Menu: VFC<MenuProps> = ({ value, onChange }) => {
  return (
    //@ts-ignore using string where number is expected. This is to ensure popover is always placed at the top of button, no matter the height value.
    <ChMenu offset={[0, "100%"]} placement="bottom" matchWidth>
      <MenuButton
        as={Box}
        p={4}
        justifyContent="space-between"
        w="100%"
        bg="transparentPurple"
        border="none"
        borderRadius={16}
        appearance="none"
        textAlign="start"
        css={{
          "span:first-child": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        }}
      >
        {value ? (
          <HStack>
            <Image boxSize={5} src={value.src} alt={value.alt} />{" "}
            <span>{value.symbol}</span>
          </HStack>
        ) : (
          "Select deposit asset"
        )}
        <Icon as={FaChevronDown} />
      </MenuButton>
      <MenuList
        px={1}
        bg="black"
        borderColor="burntPink"
        borderRadius={16}
        zIndex="overlay"
      >
        <MenuOptionGroup
          defaultValue={tokenConfig[0].symbol}
          type="radio"
        >
          {tokenConfig.map((token) => {
            const { address, src, alt, symbol } = token

            return (
              <MenuItemOption
                key={address}
                value={symbol}
                borderRadius={8}
                _hover={{ bg: "rgba(96, 80, 155, 0.4)" }}
                onClick={() => onChange(token)}
              >
                <HStack>
                  <Image boxSize={5} src={src} alt={alt} />
                  <span>{symbol}</span>
                </HStack>
              </MenuItemOption>
            )
          })}
        </MenuOptionGroup>
      </MenuList>
    </ChMenu>
  )
}
