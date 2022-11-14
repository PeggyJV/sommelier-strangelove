import { Heading, HStack } from "@chakra-ui/react"
import { VFC } from "react"
import { PercentageHeading } from "./PercentageHeading"

interface PercentageTextProps {
  data?: number
  headingSize?: "sm" | "md" | "lg" | "xl"
  arrow?: boolean
}

export const PercentageText: VFC<PercentageTextProps> = ({
  data,
  headingSize = "sm",
  arrow,
}) => {
  const percentageData = data && Math.abs(data).toFixed(2)
  const isDataZero = Number(percentageData) === 0
  const isDataNegative = data && data < 0

  return (
    <HStack
      color={
        isDataZero
          ? "white"
          : isDataNegative
          ? "red.base"
          : "lime.base"
      }
      spacing={1}
    >
      {!isDataZero && (
        <PercentageHeading
          arrow={arrow}
          isDataNegative={isDataNegative}
        />
      )}
      <Heading
        size={headingSize}
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        {percentageData || "--"}%
      </Heading>
    </HStack>
  )
}
