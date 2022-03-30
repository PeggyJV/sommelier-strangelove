import { VFC } from 'react'
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

const topRowProps: GridItemProps = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center'
}

const Layout: VFC<GridProps> = ({ children, ...rest }) => {
  return (
    <Container maxW='92.5rem'>
      <Grid
        minH='100vh'
        templateColumns='1fr 5fr'
        templateRows='80px 1fr'
        {...rest}
      >
        <GridItem display='flex' alignItems='center' {...topRowProps}>
          <Brand />
        </GridItem>
        <GridItem {...topRowProps}>
          <TopNav />
        </GridItem>
        <GridItem>
          <SideNav />
        </GridItem>
        <GridItem display='flex' px={6} flexDir='column'>
          <Box as='main' flex={1}>
            {children}
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default Layout
