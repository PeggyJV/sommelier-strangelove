import { Box, Heading, HStack, Icon } from "@chakra-ui/react"
import { VFC } from "react"

interface PercentageTextProps {
  positiveIcon: any
  negativeIcon: any
  data: number
  headingSize?: "sm" | "md" | "lg" | "xl"
}

export const PercentageText: VFC<PercentageTextProps> = ({
  positiveIcon,
  negativeIcon,
  data,
  headingSize = "sm",
}) => {
  const isDataZero = data === 0
  const isDataNegative = data < 0

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
      {isDataZero ? (
        <Box />
      ) : (
        <Icon as={isDataNegative ? negativeIcon : positiveIcon} />
      )}
      <Heading
        size={headingSize}
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        {Math.abs(data).toFixed(2)}%
      </Heading>
    </HStack>
  )
}
