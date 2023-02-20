import { VFC } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { ArrowDownFillIcon } from "./_icons/ArrowDownFillIcon"
import { ArrowUpFillIcon } from "./_icons/ArrowUpFillIcon"
import { MinusIcon } from "./_icons/MinusIcon"
import { PlusIcon } from "./_icons/PlusIcon"

interface PercentageHeadingProps {
  arrow?: boolean
  arrowT2?: boolean
  isDataNegative?: boolean | 0
}

export const PercentageHeading: VFC<PercentageHeadingProps> = ({
  arrow,
  isDataNegative,
  arrowT2,
}) => {
  return arrow ? (
    isDataNegative ? (
      <FaArrowDown />
    ) : (
      <FaArrowUp />
    )
  ) : arrowT2 ? (
    isDataNegative ? (
      <ArrowDownFillIcon boxSize={3} />
    ) : (
      <ArrowUpFillIcon boxSize={3} />
    )
  ) : isDataNegative ? (
    <MinusIcon />
  ) : (
    <PlusIcon />
  )
}
