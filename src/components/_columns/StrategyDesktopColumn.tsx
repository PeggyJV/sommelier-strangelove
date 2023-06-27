import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { InformationIcon } from "components/_icons"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { Timeline } from "data/context/homeContext"
import { Token } from "data/tokenConfig"
import { useState } from "react"
import { CellValue } from "react-table"
import { getProtocols } from "utils/getProtocols"

type StrategyDesktopColumnProps = {
  timeline: Timeline
}

export const StrategyDesktopColumn = ({
  timeline,
}: StrategyDesktopColumnProps) => {
  return [
    {
      Header: "Strategy",
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <StrategySection
            icon={row.original.logo}
            title={row.original.name}
            provider={row.original.provider.title}
            type={row.original.type}
            date={row.original.launchDate}
            description={row.original.description}
            isDeprecated={row.original.deprecated}
            w={56}
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="Protocols in which Strategy operates"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Protocols</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "protocols",
      Cell: ({ cell: { value } }: CellValue) => {
        const protocols = typeof value === "string" ? [value] : value
        const getFirst3Value = protocols.slice(0, 3)
        const getRemainingValue =
          protocols.length - getFirst3Value.length
        const [isHover, setIsHover] = useState(false)
        const handleMouseOver = () => {
          setIsHover(true)
        }
        const handleMouseLeave = () => {
          setIsHover(false)
        }
        return (
          <Box
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={20}
          >
            <HStack>
              <AvatarGroup size="sm" max={3}>
                {getFirst3Value.map((protocol: string) => {
                  const data = getProtocols(protocol)
                  return (
                    <Avatar
                      name={data.title}
                      src={data.icon}
                      key={data.title}
                      bgColor="white"
                    />
                  )
                })}
              </AvatarGroup>
              {protocols.length > 3 && (
                <Text fontWeight={600}>+{getRemainingValue}</Text>
              )}
            </HStack>
            <Flex alignItems="center" direction="column">
              {isHover && <AvatarTooltip protocols={protocols} />}
            </Flex>
          </Box>
        )
      },
      disableSortBy: true,
    },
    {
      Header: () => (
        <Tooltip
          arrowShadowColor="purple.base"
          label="Strategy will have exposure to 1 or more of these assets at any given time"
          placement="top"
          color="neutral.300"
          bg="surface.bg"
        >
          <HStack spacing={1}>
            <Text>Assets</Text>
            <InformationIcon color="neutral.400" boxSize={3} />
          </HStack>
        </Tooltip>
      ),
      accessor: "tradedAssets",
      Cell: ({ cell: { value } }: CellValue) => {
        const getFirst3Value = value.slice(0, 3)
        const getRemainingValue = value.length - getFirst3Value.length
        const [isHover, setIsHover] = useState(false)
        const handleMouseOver = () => {
          setIsHover(true)
        }
        const handleMouseLeave = () => {
          setIsHover(false)
        }
        if (!value)
          return (
            <Text fontWeight={600} fontSize="12px">
              --
            </Text>
          )
        return (
          <Box
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            w={20}
          >
            <HStack>
              <AvatarGroup size="sm">
                {getFirst3Value?.map((asset: Token) => {
                  return (
                    <Avatar
                      name={asset?.symbol}
                      src={asset?.src}
                      key={asset?.symbol}
                    />
                  )
                })}
              </AvatarGroup>
              {value.length > 3 && (
                <Text fontWeight={600}>+{getRemainingValue}</Text>
              )}
            </HStack>
            <Flex alignItems="center" direction="column">
              {isHover && <AvatarTooltip tradedAssets={value} />}
            </Flex>
          </Box>
        )
      },
      disableSortBy: true,
    },
    {
      Header: "TVL",
      accessor: "tvm.value",
      Cell: ({
        row: {
          original: { launchDate, tvm },
        },
      }: {
        row: {
          original: {
            launchDate: number
            tvm: { value: number; formatted: string }
          }
        }
      }) => (
        <Text fontWeight={600} fontSize="12px" textAlign="right">
          {launchDate && launchDate > Date.now()
            ? "--"
            : tvm?.formatted ?? "--"}
        </Text>
      ),
    },
    {
      Header: () => (
        <Text>
          Base APY
          <br />& Rewards
        </Text>
      ),
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        return (
          <ApyRewardsSection
            cellarId={row.original.slug}
            baseApy={row.original.baseApy?.formatted}
            rewardsApy={row.original.rewardsApy?.formatted}
            stackingEndDate={row.original.stakingEnd?.endDate}
            date={row.original.launchDate}
            baseApySumRewards={
              row.original.baseApySumRewards?.formatted
            }
          />
        )
      },
    },
    {
      Header: () => (
        <Text>
          {`${timeline.title} Token Price`}
          <br />
          {/* Token Price */}
        </Text>
      ),
      accessor: `changes.${timeline.value}`,
      Cell: ({ row }: any) => (
        <VStack>
          <Tooltip
            label={`Token price change`}
            color="neutral.100"
            border="0"
            fontSize="12px"
            bg="neutral.900"
            fontWeight={600}
            py="4"
            px="6"
            boxShadow="xl"
            shouldWrapChildren
          >
            <PercentageText
              data={row.original.changes?.[timeline.value]}
              arrowT2
              fontWeight={600}
            />
          </Tooltip>
          {/* <Tooltip
            label={`Token price`}
            color="neutral.100"
            border="0"
            fontSize="12px"
            bg="neutral.900"
            fontWeight={600}
            py="4"
            px="6"
            boxShadow="xl"
            shouldWrapChildren
          >
            <HStack spacing={1}>
              <Text
                fontWeight={600}
                fontSize="12px"
                color="neutral.400"
              >
                {row.original.tokenPrice}
              </Text>
            </HStack>
          </Tooltip> */}
        </VStack>
      ),
      sortType: "basic",
    },
  ]
}
