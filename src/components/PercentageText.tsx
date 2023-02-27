import { Heading, HStack } from "@chakra-ui/react"
import { VFC } from "react"
import { PercentageHeading } from "./PercentageHeading"

interface PercentageTextProps {
  data?: number
  headingSize?: "sm" | "md" | "lg" | "xl"
  arrow?: boolean
  arrowT2?: boolean
  fontWeight?: number
}

export const PercentageText: VFC<PercentageTextProps> = ({
  data,
  headingSize = "sm",
  arrow,
  arrowT2,
  fontWeight = 700,
}) => {
  const percentageData = data && Math.abs(data).toFixed(2)
  const isDataZero = Number(percentageData) === 0
  const isDataNegative = data && data < 0
  const valueExists: boolean = isDataZero || Boolean(percentageData)
  if (!data && !isDataZero) {
    return (
      <Heading
        size={headingSize}
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        --
      </Heading>
    )
  }

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
      justifyContent="flex-end"
    >
      {!isDataZero && (
        <PercentageHeading
          arrow={arrow}
          arrowT2={arrowT2}
          isDataNegative={isDataNegative}
        />
      )}
      <Heading
        size={headingSize}
        display="flex"
        alignItems="center"
        columnGap="3px"
        fontWeight={fontWeight}
        color={isDataZero && arrowT2 ? "#9E9DA3" : "current"}
      >
        {valueExists
          ? isDataZero && arrowT2
            ? "0.00"
            : percentageData
          : "--"}
        %
      </Heading>
    </HStack>
  )
}
