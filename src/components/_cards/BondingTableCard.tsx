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
  Flex,
  Tooltip,
  HStack,
  Text,
} from "@chakra-ui/react"
import TransparentCard from "./TransparentCard"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { InlineImage } from "components/InlineImage"
import { InformationIcon } from "components/_icons"
import { useAaveStaker } from "context/aaveStakerContext"
import { toEther } from "utils/formatCurrency"
interface BondingTableCardProps extends TableProps {
  data?: any
}

interface BondingPeriod {
  bondingPeriod: "7 Days" | "14 Days" | "21 Days"
  amount: number
  value: 1.1 | 1.25 | 1.5
  checked?: boolean
  canUnbond: boolean
}

const placeholderData: BondingPeriod[] = [
  {
    bondingPeriod: "14 Days",
    amount: 20.01,
    value: 1.25,
    canUnbond: false,
  },
  {
    bondingPeriod: "7 Days",
    amount: 63.99,
    value: 1.1,
    canUnbond: true,
  },
  {
    bondingPeriod: "21 Days",
    amount: 40,
    value: 1.5,
    canUnbond: false,
  },
]

const BondingTableCard: VFC<BondingTableCardProps> = ({
  data,
  ...rest
}) => {
  const { userStakeData } = useAaveStaker()
  const { userStakes } = userStakeData
  console.log(userStakes)
  return (
    <TransparentCard>
      <TableContainer>
        <Table variant="unstyled" {...rest}>
          <Thead>
            <Tr color="neutral.300">
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
                placement="top"
                bg="surface.bg"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text as="span">Bonded Tokens</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Bonding Period
              </Th>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="Amount of SOMM earned and available to be claimed"
                placement="top"
                bg="surface.bg"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text as="span">SOMM Rewards</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {userStakes?.length &&
              userStakes.map((data, i) => {
                const { amount, lock, rewards } = data

                return (
                  <Tr
                    borderBottom="1px solid"
                    borderColor="neutral.700"
                    key={i}
                    _last={{
                      border: "none",
                    }}
                  >
                    <Td>
                      <Flex
                        align="center"
                        fontSize="21px"
                        fontWeight={700}
                      >
                        <InlineImage
                          src="/assets/icons/aave.svg"
                          alt="Aave logo"
                        />{" "}
                        {toEther(amount)}
                      </Flex>
                    </Td>
                    <Td>
                      {lock?.toString() === "0" && "7 days"}
                      {lock?.toString() === "1" && "14 days"}
                      {lock?.toString() === "2" && "21 days"}
                    </Td>
                    <Td>{toEther(rewards)}</Td>
                    {/* <Td>
                      {canUnbond ? (
                        <SecondaryButton
                          size="sm"
                          onClick={() =>
                            window.alert(
                              `You've bonded for ${bondingPeriod}. You earned at a rate of ${value}x.`
                            )
                          }
                        >
                          Unbond
                        </SecondaryButton>
                      ) : (
                        <>Unbonding in N days</>
                      )}
                    </Td> */}
                    <SecondaryButton
                      size="sm"
                      onClick={() =>
                        window.alert(
                          `You've bonded for ${bondingPeriod}. You earned at a rate of ${value}x.`
                        )
                      }
                    >
                      Unbond
                    </SecondaryButton>
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
