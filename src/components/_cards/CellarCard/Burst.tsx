import { Box, Image } from "@chakra-ui/react"

export const Burst = () => {
  return (
    <Box
      width="160px"
      height="auto"
      maxW="125%"
      position="absolute"
      top="-58px"
      right="-33px"
      zIndex="1"
    >
      <picture>
        <source
          srcSet="/assets/images/burst.webp"
          type="image/webp"
        />
        <source srcSet="/assets/images/burst.png" type="image/png" />
        <Image
          width="160px"
          height="auto"
          src="/assets/images/burst.png"
          alt=""
        />
      </picture>
    </Box>
  )
}
