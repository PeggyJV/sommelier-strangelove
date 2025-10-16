import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import { VideoBannerFrame } from "./VideoBannerFrame"
import NextImage from "next/image"

export function AlphaStethIntroBanner({
  debugOutline = false,
  scale = 1,
  offsetY = 0,
}: {
  debugOutline?: boolean
  /** Scale up entire content area proportionally while keeping within 1920x1080 */
  scale?: number
  /** Additional downward shift (px) for the content block */
  offsetY?: number
}) {
  return (
    <VideoBannerFrame debugOutline={debugOutline}>
      {/* Scaled content wrapper: shrink container then scale up to fit */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <Box
          width={`calc(100% / ${scale})`}
          height={`calc(100% / ${scale})`}
          transform={`scale(${scale})`}
          transformOrigin="center"
          display="flex"
        >
          <Stack
            spacing={6}
            maxW="1400px"
            align="center"
            justify="center"
            height="full"
            textAlign="center"
            mx="auto"
            px="96px"
            mt={`${offsetY}px`}
          >
            {/* Heading + Subhead */}
            <VStack spacing={4}>
              <Text
                as="h1"
                textStyle="heroTitle"
                fontSize="72px"
                lineHeight={1.1}
                color="text.primary"
              >
                Alpha stETH <br /> Deposit Guide
              </Text>
              {/* Pill: Powered by Lido (below H1) */}
              <HStack
                spacing={3}
                bg="chip.bg"
                px={3}
                py={1}
                rounded="full"
                w="fit-content"
              >
                <NextImage
                  src="/assets/icons/lido.png"
                  alt="Lido"
                  width={24}
                  height={24}
                />
                <Text
                  fontSize="17px"
                  fontWeight={600}
                  color="chip.fg"
                >
                  Powered by Lido
                </Text>
              </HStack>
              <Text
                textStyle="bodyMd"
                fontSize="32px"
                color="text.secondary"
              >
                How to deposit into Alpha stETH, powered by Somm +
                Lido.
              </Text>
            </VStack>

            {/* Body paragraph */}
            <Text
              textStyle="bodyMd"
              maxW="1100px"
              color="#E5E7EB"
              fontSize="19.2px"
              fontStyle="italic"
              textShadow="0 1px 2px rgba(0, 0, 0, 0.25)"
            >
              Built with Lido, Alpha stETH dynamically reallocates
              stETH across Aave, Morpho, Unichain, and Mellow to
              capture sustainable rewards. Automated risk controls and
              off-chain strategy computation ensure secure, efficient
              deployment.
            </Text>

            {/* Chips */}
            <HStack
              spacing={3}
              flexWrap="wrap"
              justify="center"
              pt={2}
              mt={1}
            >
              {[
                "Blue-chip DeFi exposure",
                "stETH rewards made simple",
                "No legacy vault dependency",
              ].map((label) => (
                <Text
                  key={label}
                  as="span"
                  bg="chip.bg"
                  color="chip.fg"
                  rounded="full"
                  px={3}
                  py={1}
                  fontSize="17px"
                  cursor="default"
                >
                  {label}
                </Text>
              ))}
            </HStack>

            {/* Footer logo removed as requested */}
          </Stack>
        </Box>
      </Box>
    </VideoBannerFrame>
  )
}

export default AlphaStethIntroBanner
