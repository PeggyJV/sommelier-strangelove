import {
  BoxProps,
  Heading,
  Flex,
  Text,
  useTheme,
} from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { AboutCellar } from "./AboutCellar"
import { Burst } from "./Burst"
import { ComingSoon } from "./ComingSoon"
import { InlineImage } from "components/InlineImage"
import { CoinImage } from "./CoinImage"
import { protocolsImage } from "utils/protocolsImagePath"
import { formatDistanceToNowStrict, isFuture } from "date-fns"
import { cellarDataMap } from "data/cellarDataMap"
import { TransparentSkeleton } from "components/_skeleton"
import { formatDistance } from "utils/formatDistance"
import { isComingSoon } from "utils/isComingSoon"
import { ProtocolDataType } from "../CellarDetailsCard"
import { useStrategyData } from "data/hooks/useStrategyData"
export interface CellarCardData {
  cellarId: string
  name: string
  description: string
  strategyType: string
  managementFee: string
  protocols: string | string[]
}

interface CellarCardProps extends BoxProps {
  data: CellarCardData
  isPlaceholder?: boolean
  index?: number
}

export const CellarCardDisplay: React.FC<CellarCardProps> = ({
  data,
  isPlaceholder,
  index,
  ...rest
}) => {
  const theme = useTheme()
  const cellarConfig = cellarDataMap[data.cellarId].config

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address, cellarConfig.chain.id
  )
  const launchDate = strategyData?.launchDate
  const protocols = strategyData?.protocols!
  const isManyProtocols = typeof protocols === "object"
  const protocolData = isManyProtocols
    ? protocols.map((v: string) => {
        return {
          title: v,
          icon: protocolsImage[v],
        }
      })
    : {
        title: protocols,
        icon: protocolsImage[protocols],
      }
  const rewardsApy = strategyData?.rewardsApy
  const stakingEnd = strategyData?.stakingEnd
  const isStakingStillRunning =
    stakingEnd?.endDate && isFuture(stakingEnd?.endDate)
  const comingSoon = isComingSoon(launchDate)
  const tagLoading = isLoading

  return (
    <Card
      padding="0"
      position="relative"
      display="flex"
      maxW="400px"
      boxShadow="0 0 0 1px rgba(78, 56, 156, 0.16)"
      borderRadius={24}
      _hover={{
        backgroundColor: "surface.tertiary",
        boxShadow: "0 0 0 2px #6C4ED9",
      }}
      {...rest}
    >
      <Burst />
      <Flex
        flexDirection="column"
        borderRadius={24}
        zIndex="2"
        overflow="hidden"
      >
        {!comingSoon &&
          stakingEnd?.endDate &&
          isFuture(stakingEnd?.endDate) && (
            <Tag
              px={3}
              py={4}
              justifyContent="center"
              borderRadius={0}
              bgColor="purple.base"
              textAlign="center"
            >
              <TransparentSkeleton
                isLoaded={!tagLoading}
                h={tagLoading ? "14px" : "none"}
                startColor="purple.dark"
                endColor="surface.secondary"
              >
                <Text>
                  Rewards APY{" "}
                  <span
                    style={{
                      color: theme.colors.lime.base,
                    }}
                  >
                    {rewardsApy?.formatted}
                  </span>
                  <span> &#183; </span>
                  {isStakingStillRunning
                    ? `${formatDistanceToNowStrict(
                        stakingEnd?.endDate,
                        {
                          locale: { formatDistance },
                        }
                      )} left`
                    : "Program ends"}
                </Text>
              </TransparentSkeleton>
            </Tag>
          )}
        <Flex
          p={4}
          ml={2}
          bg="radial-gradient(104.22% 1378.1% at 0% 0%, rgba(194, 34, 194, 0) 0%, rgba(210, 37, 204, 0.16) 100%)"
          borderTopLeftRadius={24}
          minH="180.5px"
          direction="column"
          justifyContent="space-between"
        >
          <CoinImage mb={3} />
          <Flex mb={2}>
            <Heading size="lg" mr={1} lineHeight="100%">
              {data.name}
            </Heading>
          </Flex>
          <Flex wrap="wrap" gap={2}>
            <Tag>{data.strategyType}</Tag>
            <Tag>
              {data.managementFee}{" "}
              {data.managementFee !== "..." && "Fee"}
            </Tag>
            {isManyProtocols ? (
              (protocolData as ProtocolDataType[]).map((v, i) => (
                <Tag display="flex" alignItems="center" key={i}>
                  {v && (
                    <InlineImage
                      src={(v as ProtocolDataType).icon}
                      alt="protocol logo"
                      boxSize={4}
                    />
                  )}
                  {v.title}
                </Tag>
              ))
            ) : (
              <Tag display="flex" alignItems="center">
                {protocolData && (
                  <InlineImage
                    src={(protocolData as ProtocolDataType).icon}
                    alt="protocol logo"
                    boxSize={4}
                  />
                )}
                {(protocolData as ProtocolDataType).title}
              </Tag>
            )}
          </Flex>
        </Flex>
        <Flex
          p="16px 16px 24px"
          backgroundColor="surface.primary"
          borderBottomRightRadius={24}
          borderBottomLeftRadius={24}
          position="relative"
          flexDirection="column"
          justifyContent="space-between"
        >
          {isPlaceholder ? (
            <ComingSoon index={index} />
          ) : (
            <AboutCellar data={data} />
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
