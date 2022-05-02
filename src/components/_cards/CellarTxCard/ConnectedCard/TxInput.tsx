import {
  Input,
  InputGroup,
  InputGroupProps,
  InputRightAddon,
  BoxProps,
  ButtonProps,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { VFC } from "react"

interface TxInputProps extends InputGroupProps {
  disabled?: boolean
}

const disabledProps: BoxProps = {
  _disabled: {
    color: "neutral.100",
    bg: "text.body.darkMuted",
    cursor: "not-allowed",
    _hover: {
      color: "neutral.100",
      bg: "text.body.darkMuted",
    },
    _placeholder: {
      color: "neutral.100",
    },
  },
}

export const TxInput: VFC<TxInputProps> = ({ disabled, ...rest }) => {
  return (
    <InputGroup variant="unstyled" color="text.body.dark" {...rest}>
      <Input
        disabled={disabled}
        {...disabledProps}
        _placeholder={{ color: "text.body.dark" }}
        placeholder="12345.678"
        bg="white"
        px={4}
        py={2}
        borderRadius="20px 0 0 20px"
      />
      <InputRightAddon>
        <BaseButton
          variant="solid"
          disabled={disabled}
          {...(disabledProps as ButtonProps)}
          pl={2}
          pr={4}
          borderRadius="0 20px 20px 0"
        >
          Max
        </BaseButton>
      </InputRightAddon>
    </InputGroup>
  )
}
