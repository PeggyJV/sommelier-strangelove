import {
  Table,
  TableCellProps,
  TableContainer,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { VFC } from "react"

export const BorderTr: VFC<TableRowProps> = (props) => {
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
      {...props}
    />
  )
}

export const BorderTd: VFC<TableCellProps> = (props) => {
  return <Td {...props} />
}

export const StrategyTable: VFC<TableProps> = () => {
  return (
    <TableContainer>
      <Table
        variant="unstyled"
        sx={{
          borderCollapse: "collapse",
          borderRadius: "10px",
        }}
      >
        <Thead border="none" color="neutral.400">
          <BorderTr>
            <Th textTransform="unset">Strategy</Th>
            <Th textTransform="unset">Protocol</Th>
            <Th textTransform="unset">Assets</Th>
            <Th textTransform="unset">TVM</Th>
            <Th textTransform="unset">Base APY</Th>
            <Th textTransform="unset">1D</Th>
          </BorderTr>
        </Thead>
        <Tbody
          border="1px solid"
          borderRadius="20px"
          borderColor="surface.secondary"
          backgroundColor="surface.primary"
        >
          <BorderTr>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
          </BorderTr>
          <BorderTr>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
          </BorderTr>
          <BorderTr>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
          </BorderTr>
          <BorderTr>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
            <BorderTd>Tes</BorderTd>
          </BorderTr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
