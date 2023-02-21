import { Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
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
        />
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
