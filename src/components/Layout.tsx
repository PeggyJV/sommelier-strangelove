import React, { ReactElement, VFC } from 'react'
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
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  ...gridCellProps
}

const Layout: VFC<GridProps> = ({ children, ...rest }) => {
  return (
    <Container maxW='87.5rem'>
      <Grid
        minH='100vh'
        templateColumns='1fr 5fr'
        templateRows='80px 1fr'
        bg='violentViolet'
        gap='2px'
        {...rest}
      >
        <GridItem display='flex' alignItems='center' {...topRowProps}>
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
