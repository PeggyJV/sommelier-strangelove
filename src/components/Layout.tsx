import React, { ReactElement } from 'react'
import { TopNav } from './Nav/TopNav'
import { SideNav } from './Nav/SideNav'
import {
  Box,
  Container,
  Grid,
  GridItem,
  GridItemProps,
  GridProps
} from '@chakra-ui/react'
import Brand from './Nav/Brand'

const gridCellProps: GridItemProps = {
  bg: 'black'
}

const topRowProps: GridItemProps = {
  alignSelf: 'center',
  ...gridCellProps
}

const Layout = ({ children, ...rest }: GridProps): ReactElement => {
  return (
    <Container maxW='87.5rem'>
      <Grid
        minH='100vh'
        templateColumns='1fr 5fr'
        bg='violentViolet'
        gap='2px'
        {...rest}
      >
        <GridItem h='100%' display='flex' alignItems='center' {...topRowProps}>
          <Brand />
        </GridItem>
        <GridItem {...topRowProps}>
          <TopNav />
        </GridItem>
        <GridItem {...gridCellProps}>
          <SideNav />
        </GridItem>
        <GridItem display='flex' px={6} flexDir='column' {...gridCellProps}>
          <Box as='main' flex={1}>
            {children}
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default Layout
