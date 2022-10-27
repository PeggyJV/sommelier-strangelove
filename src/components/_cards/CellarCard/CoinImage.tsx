import { Box, ImageProps } from "@chakra-ui/react"
import Image from "next/image"

export const CoinImage: React.FC<ImageProps> = (props) => {
  return (
    <Box {...props}>
      <picture>
        <source
          srcSet="/assets/images/coin.webp"
          type="image/webp"
        />
        <source srcSet="/assets/images/coin.png" type="image/png" />
        <Image
          width="40px"
          height="40px"
          src="/assets/images/coin.png"
          alt="coin logo big"
        />
      </picture>
    </Box>
  )
}
