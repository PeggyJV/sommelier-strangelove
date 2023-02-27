import { PercentageText } from "components/PercentageText"
import { StrategySection } from "components/_tables/StrategySection"
import { CellValue } from "react-table"

export const SidebarColumn = [
  {
    Header: "Strategy",
    accessor: "name",
    Cell: ({ row }: any) => {
      console.log(row)
      return (
        <StrategySection
          icon={row.original.userStrategyData.strategyData.logo}
          title={row.original.userStrategyData.strategyData.name}
          description={
            row.original.userStrategyData.strategyData.description
          }
          netValue={
            row.original.userStrategyData.userData.netValue.formatted
          }
          rewards={
            row.original.userStrategyData.userData.claimableSommReward
              .formatted
          }
        />
      )
    },
    disableSortBy: true,
  },
  {
    Header: "1D",
    accessor: "userStrategyData.strategyData.changes.daily",
    Cell: ({ cell: { value } }: CellValue) => (
      <PercentageText data={value} arrowT2 fontWeight={600} />
    ),
  },
]
