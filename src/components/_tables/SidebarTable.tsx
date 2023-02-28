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
import { useRouter } from "next/router"
import { getUserDataAllStrategies } from "data/actions/common/getUserDataAllStrategies"

interface BorderTrProps extends TableRowProps {
  slug: string
}

export const BorderTr: VFC<BorderTrProps> = ({ slug, ...props }) => {
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
      onClick={() => router.push(slug)}
      _first={{
        td: {
          _first: {
            borderTopLeftRadius: 20,
          },
          _last: {
            borderTopRightRadius: 20,
          },
        },
      }}
      _last={{
        td: {
          _first: {
            borderBottomLeftRadius: 20,
          },
          _last: {
            borderBottomRightRadius: 20,
          },
        },
      }}
      {...props}
    />
  )
}

export const BorderTd: VFC<TableCellProps> = (props) => {
  return <Td {...props} py={7} />
}

export interface StrategyTableProps {
  data: Awaited<
    ReturnType<typeof getUserDataAllStrategies>
  >["strategies"]
  columns: any
}

export const SidebarTable: VFC<StrategyTableProps> = ({
  columns,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )
  return (
    <TableContainer>
      <Table
        {...getTableProps()}
        variant="unstyled"
        sx={{
          borderCollapse: "collapse",
        }}
      >
        <Thead border="none" color="neutral.400">
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
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
            return (
              <BorderTr
                {...row.getRowProps()}
                key={indexRow}
                slug={
                  "strategies/" +
                  row.original.userStrategyData.strategyData.slug
                }
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
