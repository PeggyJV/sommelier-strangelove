import { VFC } from "react"
import { Heading, HStack, StackProps, VStack } from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"

interface CellarStatsProps extends StackProps {
  tvm?: string
  apy?: string
  trending?: "up" | "down"
}

export const CellarStats: VFC<CellarStatsProps> = ({
  tvm,
  apy,
  trending,
  ...rest
}) => {
  const apyColor =
    trending === "up"
      ? "lime"
      : trending === "down"
      ? "sunsetOrange"
      : ""

  return (
    <HStack spacing={8} divider={<CardDivider />} {...rest}>
      <VStack spacing={1} align="flex-start">
        <Heading as="span" fontSize="3xl" fontWeight="bold">
          {tvm}
        </Heading>
        <CardHeading>TVM</CardHeading>
      </VStack>
      <VStack spacing={1} align="flex-start">
        <Heading
          as="span"
          fontSize="3xl"
          fontWeight="bold"
          color={apyColor}
        >
          {apy}%
        </Heading>
        <CardHeading>APY</CardHeading>
      </VStack>
    </HStack>
  )
}
