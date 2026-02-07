import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import Image from "next/image"

type FlowCircleProps = {
  label: string
  // Absolute path under public/, e.g. /assets/icons/eth.png
  // Or multiple sources for combined logos
  src?: string
  secondarySrc?: string
  // When true, apply Somm purple gradient ring accent
  gradientRing?: boolean
}

function FlowCircle({
  label,
  src,
  secondarySrc,
  gradientRing,
}: FlowCircleProps) {
  return (
    <VStack spacing={3} minW="170px">
      <Box
        position="relative"
        rounded="full"
        w="128px"
        h="128px"
        bg="blackAlpha.600"
        borderWidth={gradientRing ? "2px" : "1px"}
        borderColor={gradientRing ? "transparent" : "whiteAlpha.300"}
        overflow="hidden"
        sx={
          gradientRing
            ? {
                background:
                  "linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #6C4ED9, #ED4A7D) border-box",
              }
            : undefined
        }
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Single logo */}
        {src && !secondarySrc && (
          <Image src={src} alt={label} width={88} height={88} />
        )}
        {/* Two logos side-by-side */}
        {src && secondarySrc && (
          <HStack spacing={3}>
            <Image
              src={src}
              alt={label + " primary"}
              width={56}
              height={56}
            />
            <Image
              src={secondarySrc}
              alt={label + " secondary"}
              width={56}
              height={56}
            />
          </HStack>
        )}
      </Box>
      <Text fontSize="lg" fontWeight={600} color="whiteAlpha.900">
        {label}
      </Text>
    </VStack>
  )
}

function ArrowRight() {
  return (
    <Box role="img" aria-label="arrow">
      <Image
        src="/assets/post_assets/right_arrow.png"
        alt="arrow"
        width={84}
        height={18}
        style={{
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.4))",
        }}
      />
    </Box>
  )
}

export default function AlphaStethL2Card() {
  return (
    <Box
      id="og-root"
      width="1200px"
      height="675px"
      position="relative"
      overflow="hidden"
      rounded="lg"
      bgImage="url('/assets/post_assets/background_1.svg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    >
      {/* Content */}
      <Stack
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        spacing={12}
        px={12}
      >
        {/* Flow */}
        <HStack spacing={10} align="center" justify="center">
          <FlowCircle label="ETH" src="/assets/icons/eth.png" />
          <ArrowRight />
          <FlowCircle label="stETH" src="/assets/icons/steth.png" />
          <ArrowRight />
          <FlowCircle
            label="Alpha STETH"
            src="/assets/icons/alpha-steth.png"
            gradientRing
          />
          <ArrowRight />
          <FlowCircle
            label="Aave (Base)"
            src="/assets/icons/aave-ghost.svg"
            secondarySrc="/assets/icons/coinbase wallet.svg"
          />
        </HStack>

        {/* Footer label */}
        <Text
          fontSize="2xl"
          color="whiteAlpha.900"
          fontWeight={700}
          textAlign="center"
        >
          ETH yield where retail lives
        </Text>
      </Stack>
    </Box>
  )
}
