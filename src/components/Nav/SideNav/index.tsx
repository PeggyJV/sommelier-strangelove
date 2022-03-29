import {
  HStack,
  Icon,
  IconProps,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack
} from '@chakra-ui/react'
import Link from 'components/Link'
import { links } from './links'
import { BsDiamondFill } from 'react-icons/bs'
import { FaTelegramPlane, FaDiscord, FaTwitter } from 'react-icons/fa'
import { Card } from 'components/_cards/Card'

const iconStyles: IconProps = {
  boxSize: 9,
  p: 2,
  color: 'white',
  bg: 'backgrounds.black',
  borderRadius: '50%',
  _hover: {
    bg: 'sunsetOrange'
  }
}

export const SideNav = () => {
  return (
    <VStack h='100%' px={6} align='stretch' justify='space-between'>
      <VStack as='nav' py={8} align='flex-start'>
        <List fontFamily='brand' pb={16}>
          {links.map((link, i) => {
            const { href, title } = link
            return (
              <Link key={i} href={href}>
                <ListItem>
                  <ListIcon as={BsDiamondFill} color='electricIndigo.400' />
                  {title}
                </ListItem>
              </Link>
            )
          })}
        </List>
        <Card minW='28ch' bg='backgrounds.purpleGlassGradient'>
          <VStack align='flex-start'>
            <Text fontFamily='brand'>Join Our Community</Text>
            <Text pb={6}>
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
              consectetur.
            </Text>
            <HStack spacing={4}>
              <Link href='https://t.me/getsomm' isExternal>
                <Icon as={FaTelegramPlane} {...iconStyles} />
              </Link>
              <Link href='https://discord.com/invite/ZcAYgSBxvY' isExternal>
                <Icon as={FaDiscord} {...iconStyles} />
              </Link>
              <Link href='https://twitter.com/sommfinance' isExternal>
                <Icon as={FaTwitter} {...iconStyles} />
              </Link>
            </HStack>
          </VStack>
        </Card>
      </VStack>
      <HStack
        spacing={4}
        py={8}
        justify='center'
        borderTop='2px solid'
        borderColor='backgrounds.dark'
      >
        <Link href='/'>Documentation</Link>
        <Link href='/terms'>Terms</Link>
        <Link href='/privacy'>Privacy</Link>
      </HStack>
    </VStack>
  )
}
