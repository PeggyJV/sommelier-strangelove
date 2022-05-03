import { forwardRef, Input, InputProps } from "@chakra-ui/react"
import { VFC } from "react"

export const ModalInput: VFC<InputProps> = forwardRef<
  InputProps,
  "input"
>((props, ref) => {
  return (
    <Input
      autoComplete="off"
      ref={ref}
      size="lg"
      py={7}
      fontWeight="bold"
      border="none"
      borderRadius={16}
      placeholder="Enter Amount"
      _placeholder={{
        color: "neutral.400",
      }}
      bg="surface.secondary"
      {...props}
    />
  )
})
