import { Text, TextProps, forwardRef } from "@chakra-ui/react"
import { VFC } from "react"

export const CardHeading: VFC<TextProps> = forwardRef(
  (props, ref) => {
    return (
      <Text
        ref={ref}
        textTransform="uppercase"
        color="neutral.300"
        fontSize="0.625rem"
        {...props}
      />
    )
  }
)
