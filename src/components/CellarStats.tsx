import { VFC } from "react"
import {
  HStack,
  StackProps,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { CurrentDeposits } from "./CurrentDeposits"
import { Apy } from "./Apy"

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
        <Text as="span" fontSize="21px" fontWeight="bold">
          {tvm}
        </Text>
        <CardHeading>TVM</CardHeading>
      </VStack>
      <VStack spacing={1} align="flex-start">
        <Apy apy={apy} />
        <CardHeading>APY</CardHeading>
      </VStack>
      <CurrentDeposits
        currentDeposits={currentDeposits}
        cellarCap={cellarCap}
      />
    </HStack>
  )
}
