import { Box, Container, HStack, Icon, Link, Spacer } from '@chakra-ui/react'
import { AiOutlineSmile } from 'react-icons/ai'
import links from './links'
import ConnectButton from 'components/ConnectButton'

const Navbar = () => {
  return (
    <Container alignItems='center' as='nav' maxW='container.lg' px={4} py={2}>
      <HStack align='center' spacing={4}>
        <Box as={AiOutlineSmile} boxSize={8} />
        <Spacer />
        {links.map(({ href, title }, i) => (
          <Link key={i} href={href} textTransform='uppercase'>
            {title}
          </Link>
        ))}
        <ConnectButton />
      </HStack>
    </Container>
  )
}

export default Navbar
