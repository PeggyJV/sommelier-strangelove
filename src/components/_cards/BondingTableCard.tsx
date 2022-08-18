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
import { useAaveStaker } from "context/aaveStakerContext"
import { toEther } from "utils/formatCurrency"
import { useHandleTransaction } from "hooks/web3"
import { InformationIcon } from "components/_icons"
import { InnerCard } from "./InnerCard"
import { analytics } from "utils/analytics"

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
  const { userStakes, claimAllRewards } = userStakeData

  const handleUnstake = async (id: number) => {
    analytics.track("unstake.started")
    const tx = await aaveStakerSigner.unstake(id)

    await doHandleTransaction({
      ...tx,
      onSuccess: () => analytics.track("unstake.succeeded"),
      onError: () => analytics.track("unstake.failed"),
    })
    fetchUserStakes()
  }

  const handleUnBond = async (id: number) => {
    analytics.track("unbond.started")
    const tx = await aaveStakerSigner.unbond(id, {
      gasLimit: 1000000,
    })

    await doHandleTransaction({
      ...tx,
      onSuccess: () => analytics.track("unbond.succeeded"),
      onError: () => analytics.track("unbond.failed"),
    })
    fetchUserStakes()
  }

  const renderBondAction = (unbondTimestamp: number, i: number) => {
    const unbondTime = new Date(
      unbondTimestamp * 1000
    ).toLocaleDateString()

    const canUnstake =
      unbondTimestamp * 1000 < Date.now() &&
      unbondTimestamp.toString() !== "0"

    if (canUnstake)
      return (
        <SecondaryButton size="sm" onClick={() => handleUnstake(i)}>
          Unstake
        </SecondaryButton>
      )

    if (unbondTimestamp.toString() === "0") {
      return (
        <SecondaryButton size="sm" onClick={() => handleUnBond(i)}>
          Unbond
        </SecondaryButton>
      )
    } else {
      return <Text>{unbondTime}</Text>
    }
  }

  return (
    <InnerCard pt={6} px={4} pb={4}>
      <TableContainer>
        <Heading fontSize="lg" pl={4} pt={2} pb={4}>
          Active Bonds
        </Heading>
        <Table
          variant="unstyled"
          css={{
            "td, th": {
              padding: "12px 16px",
              height: "56px",
            },
            th: {
              height: "max-content",
            },
          }}
          {...props}
        >
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
                label="Bonded LP tokens earn yield from strategy and accrue Liquidity Mining rewards based on bonding period length"
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
                // const unbondTime = new Date(
                //   unbondTimestamp * 1000
                // ).toLocaleDateString()

                // const unbondTimeHasElapsed =
                //   unbondTimestamp * 1000 < Date.now()
                if (amount?.toString() === "0") return null
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
                    <Td>{toEther(amount)}</Td>
                    <Td>{lockMap[lock?.toString()]}</Td>
                    <Td>
                      {claimAllRewards
                        ? toEther(
                            claimAllRewards[i]?.toString() || "0",
                            6,
                            false,
                            2
                          )
                        : "0.00"}
                    </Td>
                    <Td fontWeight="normal">
                      <Flex justify="flex-end">
                        {renderBondAction(unbondTimestamp, i)}
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
