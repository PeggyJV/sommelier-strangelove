import { PercentageText } from "components/PercentageText"
import { StrategySection } from "components/_tables/StrategySection"
import { CellValue } from "react-table"

export const StrategyMobileColumn = [
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
    Header: "1D",
    accessor: "changes.daily",
    Cell: ({ cell: { value } }: CellValue) => (
      <PercentageText data={value} arrowT2 fontWeight={600} />
    ),
  },
]
