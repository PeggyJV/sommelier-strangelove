import { IconButton } from "@chakra-ui/react"
import { FC } from "react"
import { FaChevronLeft } from "react-icons/fa"
import { CustomArrowProps } from "react-slick"

export const PrevArrow: FC<CustomArrowProps> = (props) => {
  const { onClick } = props
  const displayLg = onClick === null ? "none" : "flex"

  return (
    <IconButton
      aria-label="prev"
      display={{
        base: "none",
        lg: displayLg,
      }}
      icon={<FaChevronLeft />}
      onClick={onClick}
      border="3px solid"
      background="transparent"
      borderColor="purple.base"
      position="absolute"
      _hover={{
        borderColor: "purple.base",
        background: "transparent",
      }}
      top="9rem"
      left="-3rem"
    />
  )
}
