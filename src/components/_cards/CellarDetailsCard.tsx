import dynamic from "next/dynamic"
import {
  BoxProps,
  Circle,
  HStack,
  Text,
  Tooltip,
  useTheme,
  VStack,
  Image,
  Avatar,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { InformationIcon, UsdcIcon } from "components/_icons"
import { TransparentCard } from "./TransparentCard"
import { tokenConfig } from "data/tokenConfig"
import { StrategyBreakdownCard } from "./StrategyBreakdownCard"
import { StrategyProvider } from "components/StrategyProvider"
import { CellarDataMap } from "data/types"
import { protocolsImage } from "utils/protocolsImagePath"
import { useTvm } from "data/hooks/useTvm"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { isTokenAssets } from "data/uiConfig"
import { TokenAssets } from "components/TokenAssets"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

interface CellarDetailsProps extends BoxProps {
  cellarId: string
  cellarDataMap: CellarDataMap
}

const CellarDetailsCard: VFC<CellarDetailsProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { barChartTheme } = useNivoThemes()
  const theme = useTheme()
  const {
    protocols,
    strategyType,
    strategyTypeTooltip,
    managementFee,
    managementFeeTooltip,
    strategyAssets,
    performanceSplit,
    strategyProvider,
  } = cellarDataMap[cellarId]
  const cellarStrategyAssets = tokenConfig.filter((token) =>
    strategyAssets?.includes(token.symbol)
  )
  const cellarConfig = cellarDataMap[cellarId].config
  const { data: tvm } = useTvm(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)

  // Unsure why this was necessary? Nivo acts strangely when there are fewer than three args in an index. Could be refined later.
  // const moveColors = (colorTheme: string[]): string[] => {
  //   const lastColor = colorTheme.slice(-1)
  //   const otherColors = colorTheme.slice(0, -1)
  //   return [...lastColor, ...otherColors]
  // }

  // const colors = moveColors(barChartTheme)

  const protocolIcon = protocolsImage[protocols]

  return (
    <TransparentCard p={8} overflow="visible">
      <VStack spacing={8} align={{ sm: "unset", md: "stretch" }}>
        <SimpleGrid columns={{ base: 3, lg: 4 }} spacing={6}>
          <CardStat
            label="strategy type"
            flex={0}
            tooltip={strategyTypeTooltip}
          >
            {strategyType}
          </CardStat>
          {strategyProvider && (
            <StrategyProvider strategyProvider={strategyProvider} />
          )}
          <CardStat
            label="protocols"
            flex={0}
            tooltip="Protocols in which Strategy operates"
            pr={{ sm: 2, lg: 8 }}
          >
            <Image
              src={protocolIcon}
              alt="Protocol Icon"
              boxSize={6}
              mr={2}
            />
            {protocols}
          </CardStat>
          <CardStat
            label="mgmt fee"
            flex={0}
            tooltip={
              managementFeeTooltip || "Platform management fee"
            }
          >
            <UsdcIcon
              color="purple.base"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            {managementFee}
          </CardStat>
          <CardStat
            label="TVM"
            flex={0}
            tooltip="Total value managed by Strategy"
          >
            {tvm?.formatted || "..."}
          </CardStat>
          <CardStat
            flex={0}
            label="strategy assets"
            tooltip="Strategy will have exposure to 1 or more of these assets at any given time"
          >
            <HStack>
              {isTokenAssets(cellarConfig) ? (
                <TokenAssets
                  tokens={cellarStrategyAssets}
                  activeAsset={activeAsset?.address || ""}
                  displaySymbol
                />
              ) : (
                cellarStrategyAssets.map((asset) => (
                  <HStack
                    spacing={1}
                    alignItems="center"
                    key={asset.address}
                  >
                    <Avatar
                      boxSize="24px"
                      borderWidth={2}
                      borderColor="surface.bg"
                      src={asset.src}
                      bg="surface.bg"
                      _notFirst={{
                        opacity: 0.65,
                      }}
                      _hover={{
                        opacity: 1,
                      }}
                      _groupHover={{
                        _first: {
                          opacity: 0.65,
                        },
                      }}
                      _first={{
                        _hover: {
                          opacity: "1 !important",
                        },
                      }}
                    />
                    <Text fontSize="0.625rem">78.34%</Text>
                  </HStack>
                ))
              )}
            </HStack>
          </CardStat>
          <VStack width="lg" spacing={2} align="stretch" maxW="150%">
            <HStack spacing={1} align="center">
              <Tooltip
                hasArrow
                placement="top"
                label="Strategy earned performance split"
                bg="surface.bg"
                color="neutral.300"
              >
                <HStack align="center" spacing={1}>
                  <CardHeading>performance split</CardHeading>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
            </HStack>
            <Stack h="4px">
              {/* @ts-ignore */}
              <BarChart
                layout="horizontal"
                colors={barChartTheme}
                borderColor={theme.colors.neutral[800]}
                borderWidth={1}
                borderRadius={2}
                keys={["depositors", "protocol", "strategy provider"]}
                data={[performanceSplit]}
              />
            </Stack>
            <HStack spacing={8}>
              {Object.entries(performanceSplit).map(
                ([key, value], i) => {
                  return (
                    <HStack key={i} spacing={1}>
                      <Circle size={2} bg={barChartTheme[i]} />
                      <Text
                        fontSize="0.625rem"
                        textTransform="capitalize"
                      >
                        {value}% {key}
                      </Text>
                    </HStack>
                  )
                }
              )}
            </HStack>
          </VStack>
        </SimpleGrid>

        <StrategyBreakdownCard
          cellarDataMap={cellarDataMap}
          cellarId={cellarId}
        />
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
