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
  Heading,
} from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { InlineImage } from "components/InlineImage"
import { useAaveStaker } from "context/aaveStakerContext"
import { toEther } from "utils/formatCurrency"
import { useHandleTransaction } from "hooks/web3"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { Link } from "components/Link"
import { InnerCard } from "./InnerCard"

const formatTrancheNumber = (number: number): string => {
  if (number < 10) {
    const modifiedNumber = number.toString().padStart(2, "0")

    return modifiedNumber
  }

  return number.toString()
}

const BondingTableCard: VFC<TableProps> = (props) => {
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
    <InnerCard pb={6}>
      <TableContainer>
        <Heading fontSize="lg" pl={6} py={4}>
          Active Bonds
        </Heading>
        <Table variant="unstyled" {...props}>
          <Thead>
            <Tr color="neutral.300">
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Tranche
              </Th>
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
                    <Text as="span">LP Tokens</Text>
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
                Period
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
                    <Text as="span">Reward Multiplier</Text>
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
          <Tbody fontWeight="bold">
            {userStakes?.length &&
              userStakes.map((data, i) => {
                const { amount, lock, rewards, unbondTimestamp } =
                  data
                const lockMap: { [key: string]: string } = {
                  "0": "7 days",
                  "1": "14 days",
                  "2": "21 days",
                }
                const unbondTime = new Date(
                  unbondTimestamp.toNumber() * 1000
                ).toLocaleDateString()

                return (
                  <Tr
                    key={i}
                    _hover={{
                      bg: "surface.secondary",
                      "td:first-of-type": {
                        borderRadius: "32px 0 0 32px",
                        overflow: "hidden",
                      },
                      "td:last-of-type": {
                        borderRadius: "0 32px 32px 0",
                        overflow: "hidden",
                      },
                    }}
                    _last={{
                      border: "none",
                    }}
                  >
                    <Td>#{formatTrancheNumber(i + 1)}</Td>
                    <Td>
                      <Flex align="center">
                        <InlineImage
                          src="/assets/icons/aave.png"
                          alt="Aave logo"
                          boxSize={5}
                        />{" "}
                        {toEther(amount)}
                      </Flex>
                    </Td>
                    <Td>{lockMap[lock?.toString()]}</Td>
                    <Td>{toEther(rewards)}</Td>
                    <Td fontWeight="normal">
                      <Flex justify="flex-end">
                        {unbondTimestamp.toString() === "0" ? (
                          <HStack spacing={6} minW={230}>
                            <Link
                              href="https://wallet.keplr.app/#/dashboard" // TODO: update this href to point to tx
                              isExternal
                              display="flex"
                              alignItems="center"
                              _hover={{
                                textDecor: "underline",
                              }}
                            >
                              <Text as="span">View on Keplr</Text>
                              <ExternalLinkIcon
                                ml={2}
                                color="purple.base"
                              />
                            </Link>
                            <SecondaryButton
                              size="sm"
                              onClick={() => handleUnBond(i)}
                            >
                              Unbond
                            </SecondaryButton>
                          </HStack>
                        ) : (
                          <Text>{unbondTime}</Text>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </InnerCard>
  )
}

export default BondingTableCard
