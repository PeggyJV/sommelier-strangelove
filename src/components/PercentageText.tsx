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
  const isDataZero = data === 0
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
      spacing={0}
    >
      {!isDataZero && (
        <PercentageHeading
          headingSize={headingSize}
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
        {(data && Math.abs(data).toFixed(2)) || "--"}%
      </Heading>
    </HStack>
  )
}
