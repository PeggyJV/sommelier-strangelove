import { Button, ButtonProps } from '@chakra-ui/react'
import { VFC } from 'react'

const BaseButton: VFC<ButtonProps> = props => {
  return <Button {...props} />
}

export default BaseButton
