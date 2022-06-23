import { VFC } from "react"
import { Button, ButtonProps, forwardRef } from "@chakra-ui/react"

export const SecondaryButton: VFC<ButtonProps> = forwardRef<
  ButtonProps,
  "button"
>((props, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      color="white"
      borderWidth={2}
      borderColor="purple.base"
      _hover={{ bg: "purple.dark" }}
      _disabled={{
        color: "neutral.400",
        borderColor: "purple.dark",
        cursor: "auto",
        _hover: {
          bg: "transparent",
        },
        _active: {
          bg: "transparent",
        },
      }}
      {...props}
    />
  )
})
