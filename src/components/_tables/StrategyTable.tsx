import {
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
import { getAllStrategiesData } from "data/actions/common/getAllStrategiesData"

export const BorderTr: VFC<TableRowProps> = (props) => {
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
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
  return <Td {...props} />
}

export interface StrategyTableProps {
  data: Awaited<ReturnType<typeof getAllStrategiesData>>
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
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )
  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  userSelect="none"
                  textTransform="unset"
                  {...column.getHeaderProps()}
                  key={index}
                >
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, indexRow) => {
            prepareRow(row)
            return (
              <BorderTr {...row.getRowProps()} key={indexRow}>
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
