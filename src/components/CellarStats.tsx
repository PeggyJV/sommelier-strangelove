import { VFC } from "react"
import { Heading, HStack, StackProps, VStack } from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { CurrentDeposits } from "./CurrentDeposits"
import { ArrowDownIcon, ArrowUpIcon } from "./_icons"

interface CellarStatsProps extends StackProps {
  tvm?: string
  apy?: string
  trending?: "up" | "down"
  currentDeposits?: string
  cellarCap?: string
}

export const CellarStats: VFC<CellarStatsProps> = ({
  tvm,
  apy,
  trending,
  currentDeposits,
  cellarCap,
  ...rest
}) => {
  const apyColor =
    trending === "up"
      ? "lime.base"
      : trending === "down"
      ? "red.base"
      : ""

  return (
    <HStack
      id="cellarStats"
      spacing={8}
      align="flex-start"
      wrap="wrap"
      rowGap={4}
      divider={<CardDivider />}
      {...rest}
    >
      <VStack spacing={1} align="flex-start">
        <Heading as="span" fontSize="21px" fontWeight="bold">
          {tvm}
        </Heading>
        <CardHeading>TVM</CardHeading>
      </VStack>
      <VStack spacing={1} align="flex-start">
        <HStack color={apyColor} align="center">
          {trending === "up" ? (
            <ArrowUpIcon boxSize={4} />
          ) : (
            <ArrowDownIcon boxSize={4} />
          )}
          <Heading as="span" fontSize="21px" fontWeight="bold">
            {apy}%
          </Heading>
        </HStack>
        <CardHeading>APY</CardHeading>
      </VStack>
      <CurrentDeposits
        currentDeposits={currentDeposits}
        cellarCap={cellarCap}
      />
    </HStack>
  )
}
