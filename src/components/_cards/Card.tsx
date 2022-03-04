import { VFC } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export type CardProps = VFC<BoxProps>

export const Card: CardProps = props => {
  return (
    <Box
      direction='column'
      p={4}
      borderRadius={10}
      overflow='hidden'
      {...props}
    />
  )
}
