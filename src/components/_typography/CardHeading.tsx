import { Text, TextProps } from '@chakra-ui/react'
import { VFC } from 'react'

export const CardHeading: VFC<TextProps> = props => {
  return (
    <Text
      textTransform='uppercase'
      color='text.body.lightMuted'
      fontSize='0.625rem'
      {...props}
    />
  )
}
