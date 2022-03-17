import { StackProps, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { CardDivider } from './_layout/CardDivider'

export const CardStatColumn: VFC<StackProps> = props => {
  return (
    <VStack
      spacing={3}
      justify='space-around'
      divider={<CardDivider />}
      {...props}
    />
  )
}
