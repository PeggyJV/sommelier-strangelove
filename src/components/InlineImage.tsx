import { Image, ImageProps } from "@chakra-ui/react"
import { FC } from "react"

export const InlineImage: FC<ImageProps> = ({ alt, ...rest }) => {
  return <Image display="inline-block" mr={2} alt={alt} {...rest} />
}
