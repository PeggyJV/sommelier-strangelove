import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
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
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: "Protocol",
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
      Header: "Assets",
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
      Header: "TVM",
      accessor: "tvm.value",
      Cell: ({ row }: any) => (
        <Text fontWeight={600} fontSize="12px" textAlign="right">
          {row.original.tvm.formatted}
        </Text>
      ),
    },
    {
      Header: () => (
        <Text>
          Base APY
          <br />+ Rewards
        </Text>
      ),
      accessor: "baseApy",
      Cell: ({ row }: any) => {
        return (
          <ApyRewardsSection
            baseApy={row.original.baseApy?.formatted}
            rewardsApy={row.original.rewardsApy?.formatted}
            stackingEndDate={row.original.stakingEnd?.endDate}
          />
        )
      },
    },
    {
      Header: timeline.title,
      accessor: `changes.${timeline.value}`,
      Cell: ({ cell: { value } }: CellValue) => (
        <PercentageText data={value} arrowT2 fontWeight={600} />
      ),
      sortType: "basic",
    },
  ]
}
