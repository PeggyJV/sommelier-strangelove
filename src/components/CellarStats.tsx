import { VFC } from "react"
import {
  Heading,
  HStack,
  StackProps,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { CurrentDeposits } from "./CurrentDeposits"
import { ArrowDownIcon, ArrowUpIcon } from "./_icons"

interface CellarStatsProps extends StackProps {
  tvm?: string
  apy?: string
  currentDeposits?: string
  cellarCap?: string
}

export const CellarStats: VFC<CellarStatsProps> = ({
  tvm,
  apy,
  currentDeposits,
  cellarCap,
  ...rest
}) => {
  const positiveApy = apy && parseInt(apy) > 0
  const apyColor = positiveApy ? "lime.base" : "red.base"
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  return (
    <HStack
      spacing={8}
      align="flex-start"
      wrap="wrap"
      rowGap={4}
      divider={
        <CardDivider
          css={{
            "&:nth-last-of-type(2)": {
              borderColor,
            },
          }}
        />
      }
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
          {positiveApy ? (
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
