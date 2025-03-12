import { Button, ButtonProps } from "@chakra-ui/react"
import { forwardRef } from "react"

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SecondaryButton(props, ref) {
    return (
      <Button
        ref={ref}
        variant="outline"
        color="white"
        borderWidth={2}
      borderColor="purple.base"
      disabled={props.disabled}
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
