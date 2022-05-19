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
import { useHandleTransaction } from "hooks/web3"

interface BondingTableCardProps extends TableProps {
  data?: any
}

// interface BondingPeriod {
//   bondingPeriod: "7 Days" | "14 Days" | "21 Days"
//   amount: number
//   value: 1.1 | 1.25 | 1.5
//   checked?: boolean
//   canUnbond: boolean
// }

// const placeholderData: BondingPeriod[] = [
//   {
//     bondingPeriod: "14 Days",
//     amount: 20.01,
//     value: 1.25,
//     canUnbond: false,
//   },
//   {
//     bondingPeriod: "7 Days",
//     amount: 63.99,
//     value: 1.1,
//     canUnbond: true,
//   },
//   {
//     bondingPeriod: "21 Days",
//     amount: 40,
//     value: 1.5,
//     canUnbond: false,
//   },
// ]

const BondingTableCard: VFC<BondingTableCardProps> = ({
  data,
  ...rest
}) => {
  const { userStakeData, aaveStakerSigner, fetchUserStakes } =
    useAaveStaker()
  const { doHandleTransaction } = useHandleTransaction()
  const { userStakes } = userStakeData

  const handleUnBond = async (id: number) => {
    const tx = await aaveStakerSigner.unbond(id)
    await doHandleTransaction(tx)
    fetchUserStakes()
  }

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
                const { amount, lock, rewards, unbondTimestamp } =
                  data

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
                    {unbondTimestamp.toString() === "0" ? (
                      <Td>
                        <SecondaryButton
                          size="sm"
                          onClick={() => handleUnBond(i)}
                        >
                          Unbond
                        </SecondaryButton>
                      </Td>
                    ) : (
                      <Td>
                        {new Date(
                          unbondTimestamp.toNumber() * 1000
                        ).toLocaleDateString()}
                      </Td>
                    )}
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
