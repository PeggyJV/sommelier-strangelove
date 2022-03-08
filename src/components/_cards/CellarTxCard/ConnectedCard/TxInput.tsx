import {
  Input,
  InputGroup,
  InputGroupProps,
  InputRightAddon,
  BoxProps,
  ButtonProps
} from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import { VFC } from 'react'

interface Props extends InputGroupProps {
  isConnected: boolean
}

const disabledProps: BoxProps = {
  _disabled: {
    color: 'text.body.light',
    bg: 'text.body.darkMuted',
    cursor: 'not-allowed',
    _hover: {
      color: 'text.body.light',
      bg: 'text.body.darkMuted'
    },
    _placeholder: {
      color: 'text.body.light'
    }
  }
}

export const TxInput: VFC<Props> = ({ isConnected, ...rest }) => {
  return (
    <InputGroup variant='unstyled' color='text.body.dark' {...rest}>
      <Input
        isDisabled={isConnected === false}
        {...disabledProps}
        _placeholder={{ color: 'text.body.dark' }}
        placeholder='12345.678'
        bg='white'
        px={4}
        py={2}
        borderRadius='20px 0 0 20px'
      />
      <InputRightAddon>
        <BaseButton
          variant='solid'
          isDisabled={isConnected === false}
          {...(disabledProps as ButtonProps)}
          pl={2}
          pr={4}
          borderRadius='0 20px 20px 0'
        >
          Max
        </BaseButton>
      </InputRightAddon>
    </InputGroup>
  )
}
