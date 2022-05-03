import {
  Table,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { VFC } from "react"

const BorderTr: VFC<TableRowProps> = (props) => {
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "neutral.400",
      }}
      {...props}
    />
  )
}

export const BondingTable: VFC<TableProps> = () => {
  return (
    <Table variant="unstyled">
      <Thead color="neutral.400">
        <Tr>
          <Th>bonding period</Th>
          <Th>amount</Th>
          <Th>apr</Th>
          <Th>rewards</Th>
          <Th>status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <BorderTr>
          <Td>21 Days</Td>
          <Td>-</Td>
          <Td>150%</Td>
          <Td>1.5x SOMM</Td>
          <Td>-</Td>
        </BorderTr>
        <BorderTr>
          <Td>14 Days</Td>
          <Td>-</Td>
          <Td>100%</Td>
          <Td>1.25x SOMM</Td>
          <Td>-</Td>
        </BorderTr>
        <BorderTr>
          <Td>7 Days</Td>
          <Td>-</Td>
          <Td>50%</Td>
          <Td>1.125x SOMM</Td>
          <Td>-</Td>
        </BorderTr>
      </Tbody>
    </Table>
  )
}
