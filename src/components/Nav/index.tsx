import { VFC } from 'react'
import { Flex, List, ListIcon, ListItem } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/_buttons/ConnectButton'
import { links } from './links'
import Link from 'components/Link'
import { LogoTextIcon } from 'components/_icons'

export const Nav: VFC = () => {
  const [auth] = useConnect()

  return (
    <Flex as='nav' py={4} fontSize='xl' justify='space-between' align='center'>
      <Link href='/'>
        <LogoTextIcon w='9rem' h='2rem' _hover={{ color: 'sunsetOrange' }} />
      </Link>
      <List display='flex'>
        {links.map((link, i) => {
          const { href, title, icon } = link
          return (
            <Link key={i} href={href} _notLast={{ pr: { sm: 4, md: 10 } }}>
              <ListItem display='flex' alignItems='center'>
                {icon && <ListIcon as={icon} />}
                {title}
              </ListItem>
            </Link>
          )
        })}
      </List>
      {auth.data.connectors.map(c => (
        <ConnectButton connector={c} key={c.id} />
      ))}
    </Flex>
  )
}
