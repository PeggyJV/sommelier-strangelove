import { VFC } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { MinusIcon } from "./_icons/MinusIcon"
import { PlusIcon } from "./_icons/PlusIcon"

interface PercentageHeadingProps {
  arrow?: boolean
  isDataNegative?: boolean | 0
}

export const PercentageHeading: VFC<PercentageHeadingProps> = ({
  arrow,
  isDataNegative,
}) => {
  return arrow ? (
    isDataNegative ? (
      <FaArrowDown />
    ) : (
      <FaArrowUp />
    )
  ) : isDataNegative ? (
    <MinusIcon />
  ) : (
    <PlusIcon />
  )
}
