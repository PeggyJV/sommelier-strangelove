import { HStack, StackProps } from '@chakra-ui/react'
import { VFC } from 'react'
import { CardDivider } from './_layout/CardDivider'

export const CardStatRow: VFC<StackProps> = props => {
  return (
    <HStack
      spacing={3}
      justify='space-around'
      divider={<CardDivider />}
      {...props}
    />
  )
}
