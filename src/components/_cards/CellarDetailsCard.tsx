import {
  BoxProps,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useTheme,
  VStack,
  Wrap
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { StrategyProvider } from "components/StrategyProvider"
import { TokenAssets } from "components/TokenAssets"
import { useStrategyData } from "data/hooks/useStrategyData"
import { tokenConfig } from "data/tokenConfig"
import { CellarDataMap } from "data/types"
import { useNivoThemes } from "hooks/nivo"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { isArray } from "lodash"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { VFC } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { protocolsImage } from "utils/protocolsImagePath"
import { StrategyBreakdownCard } from "./StrategyBreakdownCard"
import { TransparentCard } from "./TransparentCard"
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

export interface ProtocolDataType {
  title: string
  icon: string
}
const CellarDetailsCard: VFC<CellarDetailsProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { barChartTheme } = useNivoThemes()
  const isLarger400 = useBetterMediaQuery("(min-width: 400px)")
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
    name,
    slug,
    config: { id },
  } = cellarDataMap[cellarId]
  const filterTokenConfig = tokenConfig.filter(
    (obj, index) =>
      tokenConfig.findIndex(
        (token) => token.symbol === obj.symbol
      ) === index
  )
  const cellarStrategyAssets = filterTokenConfig.filter((token) =>
    strategyAssets?.includes(token.symbol)
  )
  const router = useRouter()
  const performanceSplitKeys = Object.keys(performanceSplit)
  const cellarConfig = cellarDataMap[cellarId].config
  const performanceFee =
    (performanceSplit["protocol"] ?? 0) +
    (performanceSplit["strategy provider"] ?? 0)

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address
  )
  const activeAsset = strategyData?.activeAsset

  const isManyProtocols = isArray(protocols)
  const protocolData = isManyProtocols
    ? protocols.map((v) => {
        return {
          title: v,
          icon: protocolsImage[v],
        }
      })
    : {
        title: protocols,
        icon: protocolsImage[protocols],
      }

  // const gridColumn = isManyProtocols
  //   ? { base: isLarger400 ? 2 : 1, sm: 2, md: 2, lg: 2 }
  //   : { base: isLarger400 ? 2 : 1, sm: 2, md: 3, lg: 4 }

  const gridColumn = {
    base: isLarger400 ? 2 : 1,
    sm: 2,
    md: 2,
    lg: 2,
  }
  return (
    <TransparentCard
      px={{ base: 0, sm: 6, md: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="visible"
    >
      <VStack
        spacing={{ base: 6, sm: 6, md: 8 }}
        align={{ sm: "unset", md: "stretch" }}
      >
        <SimpleGrid
          columns={gridColumn}
          spacing={4}
          px={{ base: 6, sm: 0 }}
        >
          <CardStat
            label="vault type"
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
            {isManyProtocols ? (
              <Wrap spacing={3}>
                  {(protocolData as ProtocolDataType[]).map((v, i) => (
                    <HStack key={i} spacing={2}>
                      <Image
                        src={v.icon}
                        alt="Protocol Icon"
                        boxSize={6}
                      />
                      <Text>{v.title}</Text>
                    </HStack>
                  ))}
              </Wrap>
            ) : (
              <>
                <Image
                  src={
                    (protocolData as ProtocolDataType).icon as string
                  }
                  alt="Protocol Icon"
                  boxSize={6}
                  mr={2}
                />
                {(protocolData as ProtocolDataType).title}
              </>
            )}
          </CardStat>
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={4}
            justifyContent="normal"
          >
            <CardStat
              label="Platform Fee"
              flex={0}
              tooltip={
                managementFeeTooltip || "Platform management fee"
              }
            >
              {managementFee}
            </CardStat>
            <CardStat
              label="Performance fee"
              flex={0}
              tooltip={`Strategy earned performance fee split: Protocol ${
                performanceSplit["protocol"] ?? 0
              }%, Strategy Provider ${
                performanceSplit["strategy provider"] ?? 0
              }%`}
            >
              {performanceFee}.00%
            </CardStat>
            <CardStat label="Deposit and Exit Fees" flex={0}>
              0.00%
            </CardStat>
          </Stack>
          <CardStat
            label="strategy assets"
            tooltip="Strategy will have exposure to 1 or more of these assets at any given time"
          >
            <HStack>
              <TokenAssets
                tokens={cellarStrategyAssets}
                activeAsset={activeAsset?.address || ""}
                displaySymbol
              />
            </HStack>
          </CardStat>
          <CardStat label="Link to contract" flex={0}>
            <Link
              href={`https://etherscan.io/address/${id.toLowerCase()}`}
              target="_blank"
            >
              {`${name} `}
              <Icon as={FaExternalLinkAlt} color="purple.base" />
            </Link>
          </CardStat>
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
