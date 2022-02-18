import React, { ReactElement } from 'react'
import { TopNav } from './Nav/TopNav'
import { SideNav } from './Nav/SideNav'
import { Box, Container, Flex, FlexProps, Grid } from '@chakra-ui/react'

interface Props extends FlexProps {}

const Layout = ({ children, ...rest }: Props): ReactElement => {
  return (
    <Container maxW='container.xl'>
      <Grid minH='100vh' templateColumns='1fr 5fr' {...rest}>
        <SideNav />
        <Flex px={6} direction='column'>
          <TopNav />
          <Box flex={1}>{children}</Box>
        </Flex>
      </Grid>
    </Container>
  )
}

export default Layout
