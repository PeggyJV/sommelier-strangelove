import { Text, Tooltip } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"

const TooltipCell = (accessor: string) => {
  const cell: React.FC<any> = ({ row }) => {
    return (
      <Tooltip
        label={`Annualized ${row.original.baseApy?.formatted} APY`}
        color="neutral.100"
        border="0"
        fontSize="12px"
        bg="neutral.900"
        fontWeight={600}
        py="4"
        px="6"
        boxShadow="xl"
        shouldWrapChildren
        isDisabled={
          !Boolean(
            Boolean(row.original.baseApy?.formatted) &&
              row.original.type === 1
          )
        }
      >
        <PercentageText
          data={row.values[accessor]}
          arrowT2
          fontWeight={600}
        />
      </Tooltip>
    )
  }
  cell.displayName = `TooltipCell(${accessor})`
  return cell
}

export const TokenValueColumn = [
  {
    Header: "Title",
    accessor: "title",
    disableSortBy: true,
  },
  {
    Header: "Price",
    accessor: "price",
    disableSortBy: true,
  },
  {
    Header: () => <Text textAlign="right">1D</Text>,
    accessor: "changes.daily",
    Cell: TooltipCell("changes.daily"),
    disableSortBy: true,
    align: "right",
  },
  {
    Header: () => <Text textAlign="right">1W</Text>,
    accessor: "changes.weekly",
    Cell: TooltipCell("changes.weekly"),
    disableSortBy: true,
    align: "right",
  },
  {
    Header: () => <Text textAlign="right">1M</Text>,
    accessor: "changes.monthly",
    Cell: TooltipCell("changes.monthly"),
    disableSortBy: true,
    align: "right",
  },
  {
    Header: () => <Text textAlign="right">All</Text>,
    accessor: "changes.allTime",
    Cell: TooltipCell("changes.allTime"),
    disableSortBy: true,
    align: "right",
  },
]
