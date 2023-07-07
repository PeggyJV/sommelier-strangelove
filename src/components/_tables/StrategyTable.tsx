import {
  Flex,
  Icon,
  Table,
  TableCellProps,
  TableContainer,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { VFC } from "react"

import { useTable, useSortBy } from "react-table"

import { SortingArrowIcon } from "components/_icons/SortingArrowIcon"
import { AllStrategiesData } from "data/actions/types"
import { useRouter } from "next/router"
import { isComingSoon } from "utils/isComingSoon"

interface BorderTrProps extends TableRowProps {
  slug: string
  name: string
}

export const BorderTr: VFC<BorderTrProps> = ({
  slug,
  name,
  ...props
}) => {
  const router = useRouter()
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
      _hover={{
        bg: "surface.secondary",
      }}
      cursor="pointer"
      onClick={() => {
        router.push(slug)
        // const landingTyp = landingType()
        // analytics.track("strategy.selection", {
        //   strategyCard: name,
        //   landingType: landingType(),
        // })
        // if (landingTyp === DIRECT) {
        //   analytics.track("strategy.selection.direct", {
        //     strategyCard: name,
        //     landingType: landingTyp,
        //   })
        // } else {
        //   analytics.track("strategy.selection.indirect", {
        //     strategyCard: name,
        //     landingType: landingTyp,
        //   })
        // }
      }}
      {...props}
    />
  )
}

export const BorderTd: VFC<TableCellProps> = (props) => {
  return <Td {...props} py={7} />
}

export interface StrategyTableProps {
  data: AllStrategiesData
  columns: any
}

export const StrategyTable: VFC<StrategyTableProps> = ({
  columns,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<any>(
    {
      columns,
      data,
    },
    useSortBy
  )

  return (
    <TableContainer
      borderColor="surface.secondary"
      borderWidth={1}
      rounded="xl"
    >
      <Table
        {...getTableProps()}
        variant="unstyled"
        sx={{
          borderCollapse: "collapse",
        }}
        rounded="lg"
      >
        <Thead border="none" color="neutral.400">
          {headerGroups.map((headerGroup, index) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              key={index}
              bg="surface.primary"
              borderBottom="1px solid"
              borderColor="surface.secondary"
            >
              {headerGroup.headers.map((column: any, index) => {
                return column.canSort ? (
                  <Th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps()
                    )}
                    userSelect="none"
                    textTransform="unset"
                    key={index}
                  >
                    <Flex
                      alignItems="center"
                      gap={2}
                      justifyContent="end"
                    >
                      {column.render("Header")}
                      <Icon as={SortingArrowIcon} boxSize={3} />
                    </Flex>
                  </Th>
                ) : (
                  <Th
                    {...column.getHeaderProps()}
                    userSelect="none"
                    textTransform="unset"
                    key={index}
                    maxW={1}
                  >
                    {column.render("Header")}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody
          backgroundColor="surface.primary"
          {...getTableBodyProps()}
        >
          {rows.map((row, indexRow) => {
            prepareRow(row)
            const countdown = isComingSoon(row.original.launchDate)
            const href = countdown
              ? "strategies/" + row.original.slug
              : "strategies/" + row.original.slug + "/manage"
            return (
              <BorderTr
                opacity={row.original.deprecated ? 0.5 : 1}
                {...row.getRowProps()}
                key={indexRow}
                slug={href}
                name={row.original.name}
              >
                {row.cells.map((cell, indexData) => {
                  return (
                    <BorderTd
                      {...cell.getCellProps()}
                      key={indexData}
                    >
                      {cell.render("Cell")}
                    </BorderTd>
                  )
                })}
              </BorderTr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
