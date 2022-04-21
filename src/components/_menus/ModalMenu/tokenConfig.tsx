import { ReactElement, VFC } from 'react'
import { Image, ImageProps } from '@chakra-ui/react'

export interface Token {
  icon: ReactElement
  symbol: string
  address: string
}

const MenuIcon: VFC<ImageProps> = ({ alt, ...rest }) => (
  <Image boxSize={4} alt={alt} {...rest} />
)

export const tokenConfig: Token[] = [
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
