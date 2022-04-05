import { VFC } from 'react'
import { Nav } from './Nav'
import { Box, Container, Flex, FlexProps } from '@chakra-ui/react'
import Footer from './Footer'

const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  return (
    <>
      <Box
        pos='absolute'
        w='50%'
        h='100%'
        bgImage='url("/assets/top-left-bg.png")'
        bgRepeat='no-repeat'
        bgSize='contain'
        zIndex='hide'
      />
      <Box
        pos='absolute'
        top='40rem'
        right={0}
        w='50%'
        h='956px'
        bgImage='url("/assets/hexagon.png")'
        bgRepeat='no-repeat'
        bgSize='contain'
        bgPos='right'
        zIndex='hide'
      />
      <Flex minH='100vh' flexDir='column' {...rest}>
        <Nav />
        <Container as='main' flex={1} maxW='container.lg'>
          {children}
        </Container>
        <Footer />
      </Flex>
    </>
  )
}

export default Layout
