import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"

const EXECUTION_RULES = [
  {
    title: "Automated Rebalancing",
    description:
      "Somm executes strategy rebalances automatically based on predefined rules and market conditions, without requiring manual intervention.",
  },
  {
    title: "Multi-Protocol Allocation",
    description:
      "Capital is dynamically allocated across multiple DeFi protocols to optimize yield while managing risk exposure.",
  },
  {
    title: "Risk Parameter Enforcement",
    description:
      "All operations are bounded by strict risk parameters including position limits, slippage thresholds, and exposure caps.",
  },
  {
    title: "Transparent Execution",
    description:
      "Every rebalance transaction is recorded onchain. LPs can verify all vault operations in real time through block explorers.",
  },
  {
    title: "Strategist Governance",
    description:
      "Strategy parameters are managed by approved strategists. Changes follow governance processes and are subject to timelock delays.",
  },
]

interface ExecutionLogicOverviewProps {
  strategyName?: string
}

export const ExecutionLogicOverview: React.FC<
  ExecutionLogicOverviewProps
> = ({ strategyName }) => {
  return (
    <Box
      bg="brand.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="lg"
      p={{ base: 6, md: 8 }}
      mt={{ base: 6, md: 8 }}
    >
      {/* Section Header */}
      <VStack align="flex-start" spacing={3} mb={6}>
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="brand.primary"
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          Vault Manager
        </Text>
        <Heading
          as="h3"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="semibold"
          color="text.primary"
        >
          Execution Logic Overview
        </Heading>
        <Text
          fontSize="sm"
          color="text.secondary"
          maxW="600px"
          lineHeight={1.6}
        >
          Somm serves as the execution layer for this vault. Here&apos;s
          how the vault manager handles operations:
        </Text>
      </VStack>

      {/* Rules List */}
      <VStack spacing={4} align="stretch">
        {EXECUTION_RULES.map((rule, index) => (
          <HStack
            key={rule.title}
            align="flex-start"
            spacing={4}
            p={4}
            bg="brand.background"
            borderRadius="md"
            border="1px solid"
            borderColor="border.subtle"
            _hover={{ borderColor: "brand.primary" }}
            transition="border-color 0.15s ease"
          >
            {/* Number indicator */}
            <Box
              flexShrink={0}
              w="32px"
              h="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(36, 52, 255, 0.1)"
              borderRadius="md"
              color="brand.primary"
              fontSize="sm"
              fontWeight="semibold"
            >
              {String(index + 1).padStart(2, "0")}
            </Box>

            {/* Content */}
            <VStack align="flex-start" spacing={1} flex={1}>
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="text.primary"
              >
                {rule.title}
              </Text>
              <Text
                fontSize="sm"
                color="text.secondary"
                lineHeight={1.5}
              >
                {rule.description}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      {/* Footer note */}
      <Box
        mt={6}
        pt={6}
        borderTop="1px solid"
        borderColor="border.subtle"
      >
        <Text fontSize="xs" color="text.secondary" lineHeight={1.6}>
          <Text as="span" fontWeight="semibold" color="text.primary">
            Note:
          </Text>{" "}
          Somm provides the infrastructure and execution layer. Strategy
          logic is defined by the strategist and operates within
          protocol-enforced boundaries. All operations are verifiable
          onchain.
        </Text>
      </Box>
    </Box>
  )
}

export default ExecutionLogicOverview

