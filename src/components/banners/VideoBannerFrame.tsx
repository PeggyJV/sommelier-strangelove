import { Box } from "@chakra-ui/react"
import NextImage from "next/image"
import { PropsWithChildren } from "react"

type VideoBannerFrameProps = PropsWithChildren<{
  id?: string
}>

export function VideoBannerFrame({
  id = "banner-root",
  children,
}: VideoBannerFrameProps) {
  return (
    <Box id={id} width="1920px" height="1080px">
      <Box
        p="2px"
        rounded="2xl"
        bgGradient="linear(to-r, #6a0dad, #9b4dff)"
        width="full"
        height="full"
      >
        <Box
          rounded="2xl"
          position="relative"
          overflow="hidden"
          width="full"
          height="full"
          bgGradient="linear(to-r, banner.bg.start 0%, banner.bg.mid 45%, banner.bg.end 100%)"
          px={{ base: 10, md: 16 }}
          py={{ base: 10, md: 16 }}
        >
          {/* Corner GG icon */}
          <Box
            aria-hidden
            position="absolute"
            right={{ base: 8, md: 12 }}
            bottom={{ base: 8, md: 12 }}
            pointerEvents="none"
            opacity={0.25}
          >
            <NextImage
              src="/assets/icons/GG.png"
              alt=""
              width={180}
              height={180}
              priority={false}
            />
          </Box>

          {/* Content */}
          <Box color="text.primary">{children}</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default VideoBannerFrame
