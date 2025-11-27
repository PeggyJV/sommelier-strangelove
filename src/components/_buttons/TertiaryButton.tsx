import { Button, ButtonProps, forwardRef } from "@chakra-ui/react"
import { FC } from "react"

export const TertiaryButton: FC<ButtonProps> = forwardRef<
  ButtonProps,
  "button"
>((props, ref) => {
  return (
    <Button
      ref={ref}
      variant="unstyled"
      display="flex"
      p={4}
      color="brand.primary"
      _hover={{ color: "brand.secondary" }}
      {...props}
    />
  )
})
