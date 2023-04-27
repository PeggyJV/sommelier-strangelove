import { Box, HStack, Text, Tooltip } from "@chakra-ui/react"
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
          highlightAnimate={false}
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

export const TokenValueColumn = (isCompareable: boolean) => [
  {
    Header: "Title",
    accessor: "title",
    disableSortBy: true,
    Cell: ({ row }: any) => {
      return (
        <HStack width={"142px"}>
          {isCompareable && (
            <Box
              boxSize="8px"
              backgroundColor={row.original.color}
              borderRadius={2}
            />
          )}
          <Text>{row.original.title}</Text>
        </HStack>
      )
    },
  },
  {
    Header: () => <Text textAlign="right">Price</Text>,
    accessor: "price",
    Cell: ({ row }: any) => (
      <Text textAlign="right">{row.original.price}</Text>
    ),
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
