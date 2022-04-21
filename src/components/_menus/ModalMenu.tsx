import {
  Box,
  HStack,
  Icon,
  Image,
  ImageProps,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps
} from '@chakra-ui/react'
import { ReactElement, useState, VFC } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface Token {
  icon: ReactElement
  symbol: string
  address: string
}

const MenuIcon: VFC<ImageProps> = ({ alt, ...rest }) => (
  <Image boxSize={4} alt={alt} {...rest} />
)

const tokenConfig: Token[] = [
  {
    icon: <MenuIcon src='/assets/icons/usdt.svg' alt='Tether logo' />,
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
  },
  {
    icon: <MenuIcon src='/assets/icons/usdc.svg' alt='USD Coin logo' />,
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  {
    icon: <MenuIcon src='/assets/icons/aave.svg' alt='Aave logo' />,
    symbol: 'AAVE',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
  }
]

export const ModalMenu: VFC<MenuProps> = props => {
  const [value, setValue] = useState<Token>()

  return (
    //@ts-ignore using string where number is expected. This is to ensure popover is always placed at the top of button, no matter the height value.
    <Menu offset={[0, '100%']} placement='bottom' matchWidth {...props}>
      <MenuButton
        as={Box}
        p={4}
        justifyContent='space-between'
        w='100%'
        bg='transparentPurple'
        border='none'
        borderRadius={16}
        appearance='none'
        textAlign='start'
        css={{
          'span:first-child': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }}
      >
        {value ? (
          <HStack>
            {value.icon} <span>{value.symbol}</span>
          </HStack>
        ) : (
          'Select deposit asset'
        )}
        <Icon as={FaChevronDown} />
      </MenuButton>
      <MenuList
        px={1}
        bg='black'
        borderColor='burntPink'
        borderRadius={16}
        zIndex='overlay'
      >
        <MenuOptionGroup defaultValue={tokenConfig[0].symbol} type='radio'>
          {tokenConfig.map(token => {
            const { address, icon, symbol } = token
            return (
              <MenuItemOption
                key={address}
                value={symbol}
                borderRadius={8}
                _hover={{ bg: 'rgba(96, 80, 155, 0.4)' }}
                onClick={() => setValue(token)}
              >
                <HStack>
                  {icon}
                  <span>{symbol}</span>
                </HStack>
              </MenuItemOption>
            )
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
