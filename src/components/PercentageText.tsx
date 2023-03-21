import {
  Heading,
  HStack,
  Skeleton,
  StackProps,
} from "@chakra-ui/react"
import { useHome } from "data/context/homeContext"
import { useEffect, useState, VFC } from "react"
import { PercentageHeading } from "./PercentageHeading"

interface PercentageTextProps extends StackProps {
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
  ...props
}) => {
  const percentageData = data && Math.abs(data).toFixed(2)
  const isDataZero = Number(percentageData) === 0
  const isDataNegative = data && data < 0
  const valueExists: boolean = isDataZero || Boolean(percentageData)

  const { timeline } = useHome()
  const [value] = useState(timeline.title)
  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => {
    setIsUpdated(true)
    const timer = setTimeout(() => {
      setIsUpdated(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [value])

  if (isUpdated) {
    return <Skeleton height="20px" />
  }

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
      {...props}
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
