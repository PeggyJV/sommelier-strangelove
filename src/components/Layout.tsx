import React, { ReactElement } from 'react'
import { TopNav } from './Nav/TopNav'
import { SideNav } from './Nav/SideNav'
import { Box, Container, Flex, Grid, GridProps } from '@chakra-ui/react'

const Layout = ({ children, ...rest }: GridProps): ReactElement => {
  return (
    <>
      <TopNav />
      <Container maxW='container.xl' py={6}>
        <Grid minH='100vh' templateColumns='1fr 5fr' {...rest}>
          <SideNav />
          <Flex px={6} direction='column'>
            <Box as='main' flex={1}>
              {children}
            </Box>
          </Flex>
        </Grid>
      </Container>
    </>
  )
}

export default Layout
