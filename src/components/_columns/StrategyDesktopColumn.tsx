import { Avatar, AvatarGroup, Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { StrategySection } from "components/_tables/StrategySection"
import { CellValue } from "react-table"
import { getProtocols } from "utils/getProtocols"
import { getTradedAssets } from "utils/getTradedAssets"

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
      return (
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
      )
    },
    disableSortBy: true,
  },
  {
    Header: "Assets",
    accessor: "tradedAssets",
    Cell: ({ cell: { value } }: CellValue) => {
      const assets = value?.map((v: any) => v.symbol)
      if (!assets)
        return (
          <Text fontWeight={600} fontSize="12px">
            --
          </Text>
        )
      return (
        <AvatarGroup size="sm" max={3}>
          {assets?.map((asset: string) => {
            const data = getTradedAssets(asset)
            return (
              <Avatar
                name={data?.symbol}
                src={data?.src}
                key={data?.symbol}
              />
            )
          })}
        </AvatarGroup>
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
    Cell: ({ cell: { value } }: CellValue) => (
      <Text fontWeight={600} fontSize="12px">
        {value?.formatted || "--"}
      </Text>
    ),
  },
  {
    Header: "1D",
    accessor: "changes.daily",
    Cell: ({ cell: { value } }: CellValue) => (
      <PercentageText data={value} arrowT2 fontWeight={600} />
    ),
  },
]
