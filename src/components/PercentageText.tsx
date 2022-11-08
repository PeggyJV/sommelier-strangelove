import { Heading, HStack } from "@chakra-ui/react"
import { VFC } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

interface PercentageTextProps {
  data?: number
  headingSize?: "sm" | "md" | "lg" | "xl"
}

export const PercentageText: VFC<PercentageTextProps> = ({
  data,
  headingSize = "sm",
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
      {!isDataZero &&
        (isDataNegative ? <FaArrowDown /> : <FaArrowUp />)}
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
