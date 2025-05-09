import { Text, TextProps } from "@chakra-ui/react"
import { ReactNode, FC } from "react"

interface ApyProps extends TextProps {
  apy?: ReactNode
}

export const Apy: FC<ApyProps> = ({ apy, ...rest }) => {
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
