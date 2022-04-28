import dynamic from "next/dynamic"
import {
  Avatar,
  Box,
  BoxProps,
  Circle,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "components/_layout/CardDivider"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { AaveIcon, UsdcIcon } from "components/_icons"
import TransparentCard from "./TransparentCard"
import { tokenConfig } from "data/tokenConfig"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

const supportedChains = [
  "DAI",
  "USDC",
  "USDT",
  "FEI",
  "TUSD",
  "BUSD",
  "GUSD",
]

const strategyAssets = tokenConfig.filter((token) =>
  supportedChains.includes(token.symbol)
)

const placeholderData = [
  {
    platform: 5,
    protocol: 5,
    depositors: 90,
  },
]

const CellarDetailsCard: VFC<BoxProps> = () => {
  const { barChartTheme } = useNivoThemes()

  return (
    <TransparentCard p={4} overflow="visible">
      <VStack spacing={4} divider={<CardDivider />} align="stretch">
        <CardStatRow align="flex-start">
          <CardStat label="strategy type" labelIcon>
            Stablecoin
          </CardStat>
          <CardStat label="strategy assets">
            <HStack spacing={-1.5}>
              {strategyAssets.map((asset) => {
                const { src, alt, address } = asset

                return (
                  <Avatar
                    key={address}
                    size="xs"
                    src={src}
                    name={alt}
                    borderWidth={2}
                    borderColor="black"
                    bg="black"
                  />
                )
              })}
            </HStack>
          </CardStat>
          <CardStat label="protocols">
            <AaveIcon
              color="violentViolet"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            AAVE
          </CardStat>
          <CardStat label="mgmt fee">
            <UsdcIcon
              color="violentViolet"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            5%
          </CardStat>
          <VStack spacing={2} align="stretch">
            <CardHeading>
              performance split <Icon boxSize={3} />
            </CardHeading>
            <Box w="100%" h="6px">
              {/* @ts-ignore */}
              <BarChart
                layout="horizontal"
                colors={barChartTheme}
                keys={["platform", "protocol", "depositors"]}
                data={placeholderData}
              />
            </Box>
            <HStack spacing={8}>
              {Object.entries(placeholderData[0]).map(
                ([key, value], i) => {
                  return (
                    <HStack key={i}>
                      <Circle size={4} bg={barChartTheme[i]} />
                      <Text fontSize="sm">
                        {value}% {key}
                      </Text>
                    </HStack>
                  )
                }
              )}
            </HStack>
          </VStack>
        </CardStatRow>
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
