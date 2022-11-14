import {
  Box,
  BoxProps,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { TransparentCard } from "./TransparentCard"
import { CardHeading } from "components/_typography/CardHeading"
import { analytics } from "utils/analytics"
import { useEthBtcChart } from "data/context/ethBtcChartContext"
import { EthBtcChart } from "components/_charts/EthBtcChart"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { PercentageText } from "components/PercentageText"
import { Legend } from "components/_charts/Legend"

export const EthBtcPerfomanceCard: VFC<BoxProps> = (props) => {
  const { timeArray, tokenPriceChange } = useEthBtcChart()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const tokenPrice = useTokenPrice(cellarConfig)
  const [timeline, setTimeline] = useState<string>("1W")

  return (
    <TransparentCard p={8} overflow="visible" {...props}>
      <VStack spacing={6} align="stretch">
        <Box h="20rem" mb={{ sm: "2.2rem", md: 0 }}>
          <HStack
            justify="space-between"
            align="flex-start"
            wrap="wrap"
            rowGap={2}
          >
            <HStack spacing={8}>
              <VStack spacing={0} align="flex-start">
                <CardHeading>Token Price</CardHeading>
                <HStack>
                  <Text fontSize="2.5rem" fontWeight="bold">
                    {tokenPrice.data || "--"}
                  </Text>
                  <PercentageText
                    data={Number(tokenPriceChange?.yFormatted)}
                    arrow
                  />
                </HStack>
                <Text color="neutral.400" fontSize="0.625rem">
                  {tokenPriceChange?.xFormatted}
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={2}>
              {timeArray.map((button, i) => {
                const { title, onClick } = button
                const isSelected = title === timeline

                return (
                  <Button
                    key={i}
                    variant="unstyled"
                    p={4}
                    py={1}
                    color={isSelected ? "white" : "neutral.400"}
                    bg={
                      isSelected
                        ? "surface.tertiary"
                        : "surface.secondary"
                    }
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={
                      isSelected ? "purple.dark" : "surface.tertiary"
                    }
                    backdropFilter="blur(8px)"
                    fontSize="sm"
                    fontWeight="semibold"
                    onClick={() => {
                      const eventName = `cellar.strategy-perfomance-selected-${title}`
                      analytics.safeTrack(eventName.toLowerCase())
                      setTimeline(title)
                      onClick()
                    }}
                  >
                    {title}
                  </Button>
                )
              })}
            </HStack>
          </HStack>
          <EthBtcChart />
        </Box>
        <HStack spacing={6}>
          <Legend
            color="purple.base"
            title={cellarDataMap[id].name}
          />
          <Legend color="violet.base" title="ETH 50/BTC 50" />
          <Legend color="turquoise.base" title="ETH" />
          <Legend color="orange.base" title="BTC" />
        </HStack>
      </VStack>
    </TransparentCard>
  )
}
