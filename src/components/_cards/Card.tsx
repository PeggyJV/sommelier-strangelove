import { VFC } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export const Card: VFC<BoxProps> = props => {
  return <Box borderRadius={10} overflow='hidden' {...props} />
}
