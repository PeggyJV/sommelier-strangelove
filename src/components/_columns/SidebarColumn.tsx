import { PercentageText } from "components/PercentageText"
import { StrategySection } from "components/_tables/StrategySection"
import { Timeline } from "data/context/homeContext"
import { CellValue } from "react-table"

type SidebarColumnProps = {
  timeline: Timeline
}

export const SidebarColumn = ({ timeline }: SidebarColumnProps) => {
  return [
    {
      Header: "Strategy",
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <StrategySection
            icon={row.original.userStrategyData.strategyData.logo}
            title={row.original.userStrategyData.strategyData.name}
            description={
              row.original.userStrategyData.strategyData.description
            }
            netValue={
              row.original.userStrategyData.userData.netValue
                .formatted
            }
            rewards={
              row.original.userStrategyData.userData
                .claimableSommReward.formatted
            }
          />
        )
      },
      disableSortBy: true,
    },
    {
      Header: timeline.title,
      accessor: `userStrategyData.strategyData.changes.${timeline.value}`,
      Cell: ({ cell: { value } }: CellValue) => (
        <PercentageText data={value} arrowT2 fontWeight={600} />
      ),
      sortType: "basic",
    },
  ]
}
