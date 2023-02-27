import { Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { ApyRewardsSection } from "components/_tables/ApyRewardsSection"
import { StrategySection } from "components/_tables/StrategySection"
import { CellValue } from "react-table"

export const StrategyTabColumn = [
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
    Header: "1D",
    accessor: "changes.daily",
    Cell: ({ cell: { value } }: CellValue) => (
      <PercentageText data={value} arrowT2 fontWeight={600} />
    ),
  },
]
