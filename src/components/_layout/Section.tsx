import { Box, BoxProps } from '@chakra-ui/react'
import { VFC } from 'react'

export const Section: VFC<BoxProps> = props => {
  return <Box as='section' py={6} {...props} />
}
