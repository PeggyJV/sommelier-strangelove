import React from "react"
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react"
import { alphaStethI18n } from "i18n/alphaSteth"

export type AlphaApyParts = {
  baseApy: number
  boostApy: number
  feesImpact: number // negative or 0
  netApy: number
  updatedAt?: string
  approximate?: boolean
}

export function AlphaStethBreakdown({ parts }: { parts: AlphaApyParts }) {
  const { isOpen, onToggle } = useDisclosure()
  const totalPos = Math.max(0, parts.baseApy) + Math.max(0, parts.boostApy)
  const basePct = totalPos ? (Math.max(0, parts.baseApy) / totalPos) * 100 : 0
  const boostPct = totalPos ? (Math.max(0, parts.boostApy) / totalPos) * 100 : 0

  return (
    <VStack spacing={2} align="stretch">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="alpha-apy-breakdown"
        _hover={{ bg: "whiteAlpha.100" }}
      >
        {alphaStethI18n.breakdownLink}
      </Button>

      {isOpen && (
        <VStack
          id="alpha-apy-breakdown"
          align="stretch"
          spacing={3}
          role="region"
        >
          {/* Stacked bar */}
          <HStack
            spacing={0}
            h="10px"
            w="100%"
            bg="whiteAlpha.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box w={`${basePct}%`} h="100%" bg="purple.600" />
            <Box w={`${boostPct}%`} h="100%" bg="purple.400" />
          </HStack>

          {/* Legend */}
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between">
              <HStack>
                <Box boxSize="10px" bg="purple.600" borderRadius="sm" />
                <Text>{alphaStethI18n.breakdownItems.lidoBase}</Text>
              </HStack>
              <Text fontWeight={600}>{pct(parts.baseApy)}</Text>
            </HStack>

            <HStack justify="space-between">
              <HStack>
                <Box boxSize="10px" bg="purple.400" borderRadius="sm" />
                <Text>{alphaStethI18n.breakdownItems.strategyBoost}</Text>
              </HStack>
              <Text fontWeight={600}>{pct(parts.boostApy)}</Text>
            </HStack>

            <HStack justify="space-between">
              <HStack>
                <Box boxSize="10px" bg="gray.500" borderRadius="sm" />
                <Text>Fees</Text>
              </HStack>
              <Text fontWeight={700} color="gray.300">
                {pct(parts.feesImpact)}
              </Text>
            </HStack>
          </VStack>

          <Text fontSize="xs" color="gray.400">
            {[
              parts.updatedAt
                ? `Updated ${new Date(parts.updatedAt).toLocaleString()}`
                : null,
              "Values are variable",
              parts.approximate ? "Some parts are estimated." : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </Text>

          <Text
            as="a"
            href={alphaStethI18n.tooltipLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="underline"
            fontSize="sm"
          >
            {alphaStethI18n.tooltipLinkText}
          </Text>
        </VStack>
      )}
    </VStack>
  )
}

function pct(n: number) {
  const rounded = Math.round(n * 10) / 10
  const sign = rounded < 0 ? "-" : ""
  const abs = Math.abs(rounded).toFixed(1)
  return `${sign}${abs}%`
}


