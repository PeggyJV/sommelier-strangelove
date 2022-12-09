import { Text, Link, HStack, Image } from "@chakra-ui/react"
import { Token as TokenType } from "data/tokenConfig"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"

export const ExchangeTab = () => {
  const id = useRouter().query.id as string
  const uniswap = strategyPageContentData[id].exchange.find(
    (v) => v.name === "Uniswap"
  )

  return (
    <Link href={uniswap?.url} target="_blank">
      <HStack
        justifyContent="space-between"
        backgroundColor="surface.secondary"
        padding={4}
        borderRadius="xl"
      >
        <HStack spacing={4}>
          <Image
            alt="uniswap icon"
            src="/assets/icons/uniswap.png"
            boxSize={6}
          />
          <Text fontSize="xl" fontWeight="bold">
            Uniswap
          </Text>
        </HStack>
        <ExternalLinkIcon />
      </HStack>
    </Link>
  )
}
