import { IconType } from 'react-icons'
import { FaDiscord, FaTelegramPlane, FaTwitter } from 'react-icons/fa'

export interface Social {
  href: string
  icon: IconType
}

export const links: Social[] = [
  {
    href: 'https://t.me/getsomm',
    icon: FaTelegramPlane
  },
  {
    href: 'https://discord.com/invite/ZcAYgSBxvY',
    icon: FaDiscord
  },
  {
    href: 'https://twitter.com/sommfinance',
    icon: FaTwitter
  }
]
