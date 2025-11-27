import { Button, ButtonProps, forwardRef } from "@chakra-ui/react"

export const SecondaryButton = forwardRef<ButtonProps, "button">(
  (props, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        color="text.primary"
        borderWidth={2}
        borderColor="border.subtle"
        borderRadius="md"
        fontWeight="semibold"
        isDisabled={props.disabled}
        _hover={{
          bg: "brand.surface",
          borderColor: "brand.primary",
        }}
        _disabled={{
          color: "text.secondary",
          borderColor: "border.subtle",
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
  }
)
