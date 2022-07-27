import { Text, TextProps } from "@chakra-ui/react"
import { ReactNode, VFC } from "react"

interface ApyProps extends TextProps {
  apy?: ReactNode
}

export const Apy: VFC<ApyProps> = ({ apy, ...rest }) => {
  return (
    <Text
      as="span"
      align="center"
      fontSize="21px"
      fontWeight="bold"
      {...rest}
    >
      {apy}
    </Text>
  )
}
