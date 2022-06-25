import { Box } from "@chakra-ui/react"
import { VFC } from "react"

export const BackgroundAssets: VFC = () => {
  return (
    <>
      <Box
        pos="absolute"
        w="50%"
        h="100%"
        bgImage='url("/assets/images/top-left-bg.png")'
        bgRepeat="no-repeat"
        bgSize="contain"
        zIndex="hide"
      />
      <Box
        pos="absolute"
        top={{
          base: "40rem",
          lg: "unset",
        }}
        bottom={{
          base: "unset",
          lg: "6.3rem",
        }}
        right={0}
        w="50%"
        h={{
          base: "956px",
          lg: "619px",
        }}
        bgImage={{
          base: 'url("/assets/images/hexagon.png")',
          lg: 'url("/assets/images/hexagonHalf.png")',
        }}
        bgRepeat="no-repeat"
        bgSize="contain"
        bgPos="right"
        zIndex="hide"
        mb="-100px"
      />
    </>
  )
}
