import { useState, VFC } from "react"
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
import { toEther } from "utils/formatCurrency"
import { useHandleTransaction } from "hooks/web3"
import { InformationIcon } from "components/_icons"
import { InnerCard } from "./InnerCard"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserStakes } from "data/hooks/useUserStakes"
import { bondingPeriodOptions } from "data/uiConfig"

const formatTrancheNumber = (number: number): string => {
  if (number < 10) {
    const modifiedNumber = number.toString().padStart(2, "0")

    return modifiedNumber
  }

  return number.toString()
}

const BondingTableCard: VFC<TableProps> = (props) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const { stakerSigner } = useCreateContracts(cellarConfig)
  const { data: userStakesRes, refetch: userStakesRefetch } =
    useUserStakes(cellarConfig)
  const { userStakes, claimAllRewards } = userStakesRes || {}

  const { doHandleTransaction } = useHandleTransaction()
  const [unbondLoading, setUnbondLoading] = useState<Set<number>>(
    new Set()
  )
  const [unstakeLoading, setUnstakeLoading] = useState<Set<number>>(
    new Set()
  )

  const handleUnstake = async (id: number) => {
    try {
      setUnstakeLoading((oldState) => {
        const newState = new Set(oldState)
        newState.add(id)
        return newState
      })
      analytics.track("unstake.started")
      const tx = await stakerSigner?.unstake(id)

      await doHandleTransaction({
        ...tx,
        onSuccess: () => analytics.track("unstake.succeeded"),
        onError: () => analytics.track("unstake.failed"),
      })
      setUnstakeLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
      userStakesRefetch()
    } catch (error) {
      setUnstakeLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
    }
  }

  const handleUnBond = async (id: number) => {
    try {
      setUnbondLoading((oldState) => {
        const newState = new Set(oldState)
        newState.add(id)
        return newState
      })
      analytics.track("unbond.started")
      const tx = await stakerSigner?.unbond(id, {
        // gas used around 63000
        gasLimit: 80000,
      })

      await doHandleTransaction({
        ...tx,
        onSuccess: () => analytics.track("unbond.succeeded"),
        onError: () => analytics.track("unbond.failed"),
      })
      setUnbondLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
      userStakesRefetch()
    } catch (error) {
      setUnbondLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
    }
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
        <SecondaryButton
          isLoading={unstakeLoading.has(i)}
          disabled={unstakeLoading.has(i)}
          size="sm"
          onClick={() => handleUnstake(i)}
        >
          Unstake
        </SecondaryButton>
      )

    if (unbondTimestamp.toString() === "0") {
      return (
        <SecondaryButton
          isLoading={unbondLoading.has(i)}
          disabled={unbondLoading.has(i)}
          size="sm"
          onClick={() => handleUnBond(i)}
        >
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
                color="neutral.300"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text>Bonded Tokens</Text>
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
                color="neutral.300"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text>SOMM Rewards</Text>
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
                const lockMap = bondingPeriodOptions(cellarConfig)

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
                    <Td>{toEther(amount.toString())}</Td>
                    <Td>{lockMap[lock].title}</Td>
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
