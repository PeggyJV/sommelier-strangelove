import { IconButton } from "@chakra-ui/react"
import { FC } from "react"
import { FaChevronRight } from "react-icons/fa"
import { CustomArrowProps } from "react-slick"

export const NextArrow: FC<CustomArrowProps> = (props) => {
  const { onClick } = props
  const displayLg = onClick === null ? "none" : "flex"

  return (
    <IconButton
      aria-label="next"
      display={{
        base: "none",
        lg: displayLg,
      }}
      icon={<FaChevronRight />}
      onClick={onClick}
      border="3px solid"
      borderColor="purple.base"
      background="transparent"
      position="absolute"
      _hover={{
        borderColor: "purple.base",
        background: "transparent",
      }}
      top="9rem"
      right="-3rem"
    />
  )
}
