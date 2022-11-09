import { Heading } from "@chakra-ui/react"
import { VFC } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

interface PercentageHeadingProps {
  headingSize?: "sm" | "md" | "lg" | "xl"
  arrow?: boolean
  isDataNegative?: boolean | 0
}

export const PercentageHeading: VFC<PercentageHeadingProps> = ({
  headingSize,
  arrow,
  isDataNegative,
}) => {
  return arrow ? (
    isDataNegative ? (
      <FaArrowDown />
    ) : (
      <FaArrowUp />
    )
  ) : (
    <Heading size={headingSize}>{isDataNegative ? "-" : "+"}</Heading>
  )
}
