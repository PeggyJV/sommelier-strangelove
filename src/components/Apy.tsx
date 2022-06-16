import { Text, TextProps } from "@chakra-ui/react"
import { VFC } from "react"

interface ApyProps extends TextProps {
  apy?: string
}

export const Apy: VFC<ApyProps> = ({ apy, ...rest }) => {
  return (
    <Text align="center" fontSize="21px" fontWeight="bold" {...rest}>
      {apy}%
    </Text>
  )
}
