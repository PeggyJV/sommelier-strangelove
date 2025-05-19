import { Text, TextProps, forwardRef } from "@chakra-ui/react"
import { FC } from "react"

export const CardHeading: FC<TextProps> = forwardRef(
  (props, ref) => {
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
