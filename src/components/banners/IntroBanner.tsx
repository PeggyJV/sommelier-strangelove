import { HStack, Stack, Text, VStack } from "@chakra-ui/react"
import { BannerFrame } from "./BannerFrame"
import NextImage from "next/image"

export function IntroBanner() {
  return (
    <BannerFrame showPill={false} contentOffsetY={100}>
      <Stack
        spacing={6}
        maxW="1080px"
        align="center"
        justify="center"
        height="full"
        textAlign="center"
        mx="auto"
        px="96px"
      >
        <VStack spacing={4}>
          <Text
            as="h1"
            textStyle="heroTitle"
            fontSize="96px"
            color="text.primary"
          >
            Alpha stETH Vault
          </Text>
          {/* Pill just under title */}
          <HStack
            spacing={3}
            bg="chip.bg"
            px={3}
            py={1}
            rounded="full"
          >
            <NextImage
              src="/assets/icons/lido.png"
              alt="Lido"
              width={24}
              height={24}
            />
            <Text fontSize="sm" fontWeight={600} color="chip.fg">
              Powered by Lido
            </Text>
          </HStack>
          <Text
            textStyle="bodyMd"
            fontSize="32px"
            color="text.secondary"
          >
            Dynamic leveraged stETH strategy powered by Somm + Lido.
          </Text>
        </VStack>

        <Text textStyle="bodyMd" maxW="1100px" color="text.secondary">
          Built with Lido, Alpha stETH dynamically reallocates stETH
          across Aave, Morpho, Unichain, and Mellow to capture
          sustainable rewards. Automated risk controls and off-chain
          strategy computation ensure secure, efficient deployment.
        </Text>

        <HStack spacing={3} flexWrap="wrap" justify="center" pt={2}>
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
              fontSize="sm"
              cursor="default"
            >
              {label}
            </Text>
          ))}
        </HStack>
      </Stack>
    </BannerFrame>
  )
}

export default IntroBanner
