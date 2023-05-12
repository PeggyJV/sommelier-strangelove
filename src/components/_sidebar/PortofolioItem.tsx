import { StackProps, HStack, VStack, Text } from "@chakra-ui/react"
import Image from "next/image"

export const PortofolioItem = (props: StackProps) => {
  return (
    <HStack
      px={8}
      py={4}
      borderBottom="1px solid"
      borderColor="surface.secondary"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    >
      <Image
        height={45}
        width={45}
        src={"/assets/icons/defi-stars.png"}
        alt="strategy icon"
      />
      <VStack
        spacing={0}
        h="100%"
        alignSelf="baseline"
        alignItems="flex-start"
      >
        <Text as="h6" fontSize={16} fontWeight={700}>
          Real Yield USD
        </Text>
        <Text fontWeight={500} fontSize={12} color="neutral.400">
          984.00 Tokens
        </Text>
        <Text fontWeight={500} fontSize={12} color="neutral.400">
          1 token = 1.03 USDC ($1.03)
        </Text>
      </VStack>
      <VStack
        spacing={0}
        h="100%"
        alignSelf="baseline"
        alignItems="flex-end"
        textAlign="right"
      >
        <Text as="h6" fontSize={16} fontWeight={700}>
          $1,103.00
        </Text>
        <Text fontWeight={500} fontSize={12} color="neutral.400">
          1,103.00 USDC
        </Text>
      </VStack>
    </HStack>
  )
}
