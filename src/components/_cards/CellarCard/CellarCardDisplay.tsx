import { BoxProps, Heading, Flex, Text } from "@chakra-ui/react"
import { Card } from "components/_cards/Card"
import { Tag } from "components/Tag"
import { AboutCellar } from "./AboutCellar"
import { Burst } from "./Burst"
import { ComingSoon } from "./ComingSoon"
import { InlineImage } from "components/InlineImage"
import { CoinImage } from "./CoinImage"
import { protocolsImage } from "utils/protocolsImagePath"
import { formatDistanceToNow, isFuture } from "date-fns"
export interface CellarCardData {
  cellarId: string
  name: string
  description: string
  strategyType: string
  managementFee: string
  protocols: string
  staking?: {
    endDate: Date
    multiplier: string
  }
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
  const protocolIcon = protocolsImage[data.protocols]

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
        {data?.staking && isFuture(data?.staking?.endDate) && (
          <Tag
            px={6}
            py={3}
            justifyContent="center"
            borderRadius={0}
            bgColor="purple.base"
          >
            <Text>{`Expected 21% APY . ${formatDistanceToNow(
              data?.staking?.endDate
            )} left`}</Text>
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
            <Tag display="flex" alignItems="center">
              {protocolIcon && (
                <InlineImage
                  src={protocolIcon}
                  alt="aave logo"
                  boxSize={4}
                />
              )}
              {data.protocols}
            </Tag>
          </Flex>
        </Flex>
        <Flex
          p="16px 16px 24px"
          backgroundColor="surface.primary"
          borderBottomRightRadius={24}
          borderBottomLeftRadius={24}
          position="relative"
          flexGrow="1"
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
