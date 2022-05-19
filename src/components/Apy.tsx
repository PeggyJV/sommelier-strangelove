import { HStack, StackProps, Text } from "@chakra-ui/react"
import { VFC } from "react"
import { ArrowDownIcon, ArrowUpIcon } from "./_icons"

interface ApyProps extends StackProps {
  apy?: string
}

export const Apy: VFC<ApyProps> = ({ apy, ...rest }) => {
  const positiveApy = apy && parseInt(apy) >= 0
  const apyColor = positiveApy ? "lime.base" : "red.base"

  return (
    <HStack
      color={apyColor}
      align="center"
      fontSize="21px"
      fontWeight="bold"
      {...rest}
    >
      {positiveApy ? (
        <ArrowUpIcon boxSize={4} />
      ) : (
        <ArrowDownIcon boxSize={4} />
      )}
      <Text as="span">{apy}%</Text>
    </HStack>
  )
}
