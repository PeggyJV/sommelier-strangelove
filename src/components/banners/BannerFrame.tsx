import { Box, HStack, Text } from "@chakra-ui/react"
import NextImage from "next/image"
import { PropsWithChildren } from "react"

type BannerFrameProps = PropsWithChildren<{
  id?: string
  showPill?: boolean
  contentOffsetY?: number
}>

// Locked layout frame: gradient background + fixed brand/watermark layers
// Z-order: background (0) → ETH watermark (1) → content (2) → pill + brand lockup (3)
export function BannerFrame({
  id = "banner-root",
  children,
  showPill = true,
  contentOffsetY = 0,
}: BannerFrameProps) {
  return (
    <Box
      id={id}
      width="1920px"
      height="1080px"
      position="relative"
      overflow="hidden"
    >
      {/* Gradient border */}
      <Box
        p="2px"
        rounded="2xl"
        bgGradient="linear(to-r, #6a0dad, #9b4dff)"
        width="full"
        height="full"
      >
        {/* Gradient background surface */}
        <Box
          rounded="2xl"
          position="relative"
          overflow="hidden"
          width="full"
          height="full"
          bgGradient="linear(to-r, banner.bg.start 0%, banner.bg.mid 45%, banner.bg.end 100%)"
        >
          {/* stETH watermark (locked) */}
          <Box
            aria-hidden
            position="absolute"
            right={{ base: 24, md: 180 }}
            bottom={{ base: 24, md: 40 }}
            opacity={0.1}
            pointerEvents="none"
            zIndex={1}
            userSelect="none"
          >
            <NextImage
              src="/assets/icons/steth.png"
              alt=""
              width={420}
              height={420}
            />
          </Box>

          {/* Content slot (editable) */}
          <Box
            position="absolute"
            inset={0}
            zIndex={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={{ base: 10, md: 16 }}
            style={{ transform: `translateY(${contentOffsetY}px)` }}
          >
            {children}
          </Box>

          {/* Pill: Powered by Lido (locked) */}
          {showPill && (
            <Box
              aria-hidden
              position="absolute"
              top={{ base: 6, md: 9 }}
              left="50%"
              transform="translateX(-50%)"
              pointerEvents="none"
              zIndex={3}
            >
              <HStack
                spacing={3}
                bg="chip.bg"
                px={3}
                py={1}
                rounded="full"
              >
                <NextImage
                  src="/assets/icons/lido.png"
                  alt=""
                  width={24}
                  height={24}
                />
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight={600}
                  color="chip.fg"
                >
                  Powered by Lido
                </Text>
              </HStack>
            </Box>
          )}

          {/* Bottom brand lockup (locked): Somm bottom-center + Lido egg bottom-right */}
          <Box
            aria-hidden
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            bottom={{ base: 8, md: 10 }}
            pointerEvents="none"
            zIndex={3}
            userSelect="none"
          >
            <NextImage
              src="/assets/tutorial/somm.png"
              alt=""
              width={224}
              height={56}
              style={{
                height: "56px",
                width: "auto",
                display: "block",
                opacity: 0.9,
              }}
            />
          </Box>
          {/* Bottom-right GG logo (tutorial asset) */}
          <Box
            aria-hidden
            position="absolute"
            right={{ base: 8, md: 10 }}
            bottom={{ base: 8, md: 10 }}
            pointerEvents="none"
            zIndex={3}
            userSelect="none"
          >
            <NextImage
              src="/assets/tutorial/GG.png"
              alt=""
              width={96}
              height={96}
              style={{
                height: "96px",
                width: "auto",
                display: "block",
                opacity: 0.9,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BannerFrame
