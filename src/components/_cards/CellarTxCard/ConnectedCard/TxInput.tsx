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

export const TxInput: VFC<InputGroupProps> = props => {
  return (
    <InputGroup variant='unstyled' color='text.body.dark' {...props}>
      <Input
        isDisabled={false}
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
          isDisabled={false}
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
