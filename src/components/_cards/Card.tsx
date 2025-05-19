import { FC } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export type CardProps = FC<BoxProps>

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
