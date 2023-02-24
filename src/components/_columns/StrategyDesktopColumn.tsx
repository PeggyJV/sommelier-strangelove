import {
  Avatar,
  AvatarGroup,
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { AvatarTooltip } from "components/_tooltip/AvatarTooltip"
import { Token } from "data/tokenConfig"
import { useState } from "react"
import { CellValue } from "react-table"
import { getProtocols } from "utils/getProtocols"

export const StrategyDesktopColumn = [
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
      const [isHover, setIsHover] = useState(false)
      const handleMouseOver = () => {
        setIsHover(true)
      }
      const handleMouseLeave = () => {
        setIsHover(false)
      }
      return (
        <Flex
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
          alignItems="center"
          direction="column"
        >
          <AvatarGroup size="sm" max={3}>
            {protocols.map((protocol: string) => {
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
          {isHover && <AvatarTooltip protocols={protocols} />}
        </Flex>
      )
    },
    disableSortBy: true,
  },
  {
    Header: "Assets",
    accessor: "tradedAssets",
    Cell: ({ cell: { value } }: CellValue) => {
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
        <Flex
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
          alignItems="center"
          direction="column"
        >
          <AvatarGroup size="sm" max={3}>
            {value?.map((asset: Token) => {
              return (
                <Avatar
                  name={asset?.symbol}
                  src={asset?.src}
                  key={asset?.symbol}
                />
              )
            })}
          </AvatarGroup>
          {isHover && <AvatarTooltip tradedAssets={value} />}
        </Flex>
      )
    },
    disableSortBy: true,
  },
  {
    Header: "TVM",
    accessor: "tvm.value",
    Cell: ({ row }: any) => (
      <Text fontWeight={600} fontSize="12px">
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
    Header: "1D",
    accessor: "changes.daily",
    Cell: ({ cell: { value } }: CellValue) => (
      <PercentageText data={value} arrowT2 fontWeight={600} />
    ),
  },
]
