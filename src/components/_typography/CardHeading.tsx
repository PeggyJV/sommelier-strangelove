import { Text, TextProps, forwardRef } from "@chakra-ui/react"
import { VFC } from "react"

export const CardHeading: VFC<TextProps> = forwardRef(
  (props, ref) => {
    return (
      <Text
        ref={ref}
        textTransform="uppercase"
        color="text.body.lightMuted"
        fontSize="0.625rem"
        {...props}
      />
    )
  }
)
