import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { VFC } from "react"
import { useSortBy, useTable } from "react-table"

type DataTypes = {
  title: string
  price: number
  changes: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
    allTime: number
  }
}

export interface TokenValueTableProps {
  data: DataTypes[]
  columns: any
}

export const TokenValueTable: VFC<TokenValueTableProps> = ({
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
    <TableContainer rounded="xl">
      <Table {...getTableProps()} variant="unstyled">
        <Thead border="none" color="neutral.400">
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: any, index) => {
                return (
                  <Th
                    pl={0}
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
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, indexRow) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()} key={indexRow}>
                {row.cells.map((cell, indexData) => {
                  return (
                    <Td
                      pl={0}
                      {...cell.getCellProps()}
                      key={indexData}
                    >
                      {cell.render("Cell")}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
