import React, { ReactElement } from 'react'

import Navbar from './Navbar'

import { Box, Flex, FlexProps } from '@chakra-ui/react'

interface Props extends FlexProps {}

const Layout = ({ children, ...rest }: Props): ReactElement => {
  return (
    <Flex direction='column' minH='100%' {...rest}>
      <Navbar />
      <Box flex={1}>{children}</Box>
    </Flex>
  )
}

export default Layout
