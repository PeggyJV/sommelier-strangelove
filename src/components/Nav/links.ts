import { VFC } from 'react'
import { IconProps } from '@chakra-ui/react'
import { CellarGradientIcon, OverviewGradientIcon } from 'components/_icons'
import { IconType } from 'react-icons'

export interface Link {
  href: string
  title: string
  icon?: IconType | VFC<IconProps>
}

export const links: Link[] = [
  {
    href: '/',
    title: 'Overview',
    icon: OverviewGradientIcon
  },
  {
    href: '/cellars',
    title: 'Cellars',
    icon: CellarGradientIcon
  }
]
