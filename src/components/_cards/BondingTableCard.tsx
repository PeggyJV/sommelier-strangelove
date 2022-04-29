import { VFC } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableProps,
} from "@chakra-ui/react"
import TransparentCard from "./TransparentCard"
import { TertiaryButton } from "components/_buttons/TertiaryButton"

interface BondingTableCardProps extends TableProps {
  data?: any
}

interface BondingPeriod {
  bondingPeriod: "7 Days" | "14 Days" | "21 Days"
  amount: number
  value: 1.1 | 1.25 | 1.5
  checked?: boolean
}

const placeholderData: BondingPeriod[] = [
  {
    bondingPeriod: "14 Days",
    amount: 2000.01,
    value: 1.25,
  },
  {
    bondingPeriod: "7 Days",
    amount: 2063.99,
    value: 1.1,
  },
  {
    bondingPeriod: "21 Days",
    amount: 4000,
    value: 1.5,
  },
]

const BondingTableCard: VFC<BondingTableCardProps> = ({
  data,
  ...rest
}) => {
  return (
    <TransparentCard>
      <TableContainer>
        <Table variant="unstyled" size="sm" {...rest}>
          <Thead>
            <Tr
              borderBottom="1px solid"
              borderColor="text.body.lightMuted"
              color="text.body.lightMuted"
            >
              <Th fontSize={10} fontWeight="normal">
                Bonding Period
              </Th>
              <Th fontSize={10} fontWeight="normal">
                Bonded Amount
              </Th>
              <Th fontSize={10} fontWeight="normal">
                Unbond Tokens
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {placeholderData.map((data, i) => {
              const { amount, bondingPeriod, value } = data
              return (
                <Tr
                  borderBottom="1px solid"
                  borderColor="text.body.lightMuted"
                  key={i}
                >
                  <Td>{bondingPeriod}</Td>
                  <Td>{amount.toFixed(2)}</Td>
                  <Td>
                    <TertiaryButton
                      size="sm"
                      onClick={() =>
                        window.alert(
                          `You've bonded for ${bondingPeriod}. You earned at a rate of ${value}x.`
                        )
                      }
                    >
                      Unbond
                    </TertiaryButton>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </TransparentCard>
  )
}

export default BondingTableCard
