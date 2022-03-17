import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { VFC } from 'react'

export const BondingTable: VFC<TableProps> = () => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>bonding period</Th>
          <Th>amount</Th>
          <Th>apr</Th>
          <Th>rewards</Th>
          <Th>status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>21 Days</Td>
          <Td>-</Td>
          <Td>150%</Td>
          <Td>1.5x SOMM</Td>
          <Td>-</Td>
        </Tr>
        <Tr>
          <Td>14 Days</Td>
          <Td>-</Td>
          <Td>100%</Td>
          <Td>1.25x SOMM</Td>
          <Td>-</Td>
        </Tr>
        <Tr>
          <Td>7 Days</Td>
          <Td>-</Td>
          <Td>50%</Td>
          <Td>1.125x SOMM</Td>
          <Td>-</Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
