import { Box } from "@chakra-ui/react"
import NextImage from "next/image"
import { PropsWithChildren } from "react"

type VideoBannerFrameProps = PropsWithChildren<{
  id?: string
  /**
   * When true, shows a subtle dashed outline to verify 1920x1080 crop.
   * Should be disabled for export screenshots.
   */
  debugOutline?: boolean
}>

export function VideoBannerFrame({
  id = "banner-root",
  children,
  debugOutline = false,
}: VideoBannerFrameProps) {
  return (
    <Box id={id} width="1920px" height="1080px" position="relative">
      {/* Optional debug outline (non-export) */}
      {debugOutline && (
        <Box
          pointerEvents="none"
          position="absolute"
          inset={0}
          outline="1px dashed rgba(255,255,255,0.25)"
          zIndex={1}
        />
      )}

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
          {/* Top-left stETH watermark */}
          <Box
            aria-hidden
            position="absolute"
            left={{ base: 16, md: 24 }}
            top={{ base: 16, md: 24 }}
            opacity={0.22}
            pointerEvents="none"
          >
            <NextImage
              src="/assets/icons/steth.png"
              alt=""
              width={280}
              height={280}
            />
          </Box>

          {/* Bottom-right: GG orb */}
          <Box
            aria-hidden
            position="absolute"
            right={{ base: 8, md: 12 }}
            bottom={{ base: 8, md: 12 }}
            pointerEvents="none"
          >
            <NextImage
              src="/assets/tutorial/GG.png"
              alt=""
              width={140}
              height={140}
              priority={false}
            />
          </Box>

          {/* Bottom-center: Somm logo */}
          <Box
            aria-hidden
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            bottom={{ base: 8, md: 12 }}
            pointerEvents="none"
          >
            <NextImage
              src="/assets/tutorial/somm.png"
              alt=""
              width={160}
              height={48}
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
