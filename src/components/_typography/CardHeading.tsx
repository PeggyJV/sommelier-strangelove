import { Text, TextProps } from "@chakra-ui/react"
import { forwardRef } from "react"

export const CardHeading = forwardRef<HTMLParagraphElement, TextProps>(
  function CardHeading(props, ref) {
    return (
      <Text
        ref={ref}
        textTransform="capitalize"
        color="neutral.300"
        fontSize="0.625rem"
        {...props}
      />
    )
  }
)
