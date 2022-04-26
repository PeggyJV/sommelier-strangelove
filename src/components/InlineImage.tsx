import { Image, ImageProps } from "@chakra-ui/react"
import { VFC } from "react"

export const InlineImage: VFC<ImageProps> = ({ alt, ...rest }) => {
  return <Image display="inline-block" mr={2} alt={alt} {...rest} />
}
