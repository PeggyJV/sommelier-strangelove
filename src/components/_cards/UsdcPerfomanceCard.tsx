import {
  Box,
  BoxProps,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { TransparentCard } from "./TransparentCard"
import { CardHeading } from "components/_typography/CardHeading"
import { analytics } from "utils/analytics"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { PercentageText } from "components/PercentageText"
import { Legend } from "components/_charts/Legend"
import { useUsdcChart } from "data/context/usdcChartContext"
import { UsdcChart } from "components/_charts/UsdcChart"

export const UsdcPerfomanceCard: VFC<BoxProps> = (props) => {
  const {
    timeArray,
    tokenPriceChange,
    showLine,
    setShowLine,
    fetching,
  } = useUsdcChart()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const tokenPrice = useTokenPrice(cellarConfig)
  const [timeline, setTimeline] = useState<string>("1W")

  return (
    <TransparentCard
      px={{ base: 6, sm: 6, md: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="visible"
      {...props}
    >
      {/* TODO: Add Error, loading state */}
      <VStack spacing={6} align="stretch">
        <Box h="20rem" mb={{ base: 12, sm: "2.2rem", md: 0 }}>
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
          <UsdcChart
            timeline={timeline}
            name={cellarDataMap[id].name}
          />
        </Box>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 2, md: 4 }}
        >
          <Legend
            color="purple.base"
            title={cellarDataMap[id].name}
            active={showLine.tokenPrice}
            onClick={() => {
              setShowLine((prev) => ({
                ...prev,
                tokenPrice: !showLine.tokenPrice,
              }))
            }}
          />
          <Legend
            color="violet.base"
            title="USDC"
            active={showLine.usdc}
            onClick={() => {
              setShowLine((prev) => ({
                ...prev,
                ethBtc50: !showLine.usdc,
              }))
            }}
          />
        </Stack>
      </VStack>
    </TransparentCard>
  )
}
