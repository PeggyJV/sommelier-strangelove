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
  Image,
  Icon,
  Link
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
import { bondingPeriodOptions } from "data/uiConfig"
import { formatDistanceToNowStrict, isFuture } from "date-fns"
import { formatDistance } from "utils/formatDistance"
import { LighterSkeleton } from "components/_skeleton"
import { useGeo } from "context/geoContext"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { differenceInDays } from "date-fns"
import { config } from "utils/config"
import { FaExternalLinkAlt } from "react-icons/fa"

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
  const { data: strategyData } = useStrategyData(
    cellarConfig.cellar.address
  )
  const {
    data: userData,
    isLoading,
    refetch,
  } = useUserStrategyData(cellarConfig.cellar.address)
  const { stakerSigner } = useCreateContracts(cellarConfig)
  const [unbondLoading, setUnbondLoading] = useState<Set<number>>(
    new Set()
  )
  const [unstakeLoading, setUnstakeLoading] = useState<Set<number>>(
    new Set()
  )

  const stakingEnd = strategyData?.stakingEnd
  const userDatas = userData?.userStakes
  const { userStakes, claimAllRewards } = userDatas || {}

  const { doHandleTransaction } = useHandleTransaction()

  const geo = useGeo()

  const handleUnstake = async (id: number) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
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
      refetch()
    } catch (error) {
      setUnstakeLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
    }
  }

  const handleUnBond = async (id: number) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
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
      refetch()
    } catch (error) {
      setUnbondLoading((oldState) => {
        const newState = new Set(oldState)
        newState.delete(id)
        return newState
      })
    }
  }

  const renderBondAction = (unbondTimestamp: number, i: number) => {
    const unbondTime = new Date(unbondTimestamp * 1000)

    const differenceDays = differenceInDays(unbondTime, new Date())

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
      return (
        <Text>
          Unbond in {differenceDays} day
          {differenceDays > 1 ? "s" : ""}
        </Text>
      )
    }
  }

  return (
    <InnerCard
      bg="surface.tertiary"
      backdropFilter="none"
      pt={6}
      px={4}
      pb={4}
    >
      <TableContainer>
        <HStack justifyContent="space-between" px={4} pt={2} pb={4}>
          <Heading fontSize="lg">Active Bonds</Heading>
          <LighterSkeleton isLoaded={!isLoading} height={4}>
            {stakingEnd?.endDate && isFuture(stakingEnd?.endDate) && (
              <Text fontSize="xs">
                {stakingEnd?.endDate && isFuture(stakingEnd.endDate)
                  ? `Rewards program ends in ${formatDistanceToNowStrict(
                      stakingEnd?.endDate,
                      {
                        locale: { formatDistance },
                      }
                    )}`
                  : "Program Ended"}
              </Text>
            )}
          </LighterSkeleton>
        </HStack>

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
              {cellarConfig.customRewardWithoutAPY?.showRewards ===
                true ||
              cellarConfig.customRewardWithoutAPY === undefined ? (
                <>
                  <Tooltip
                    hasArrow
                    arrowShadowColor="purple.base"
                    label={`Amount of ${
                      cellarConfig?.customRewardWithoutAPY
                        ?.tokenSymbol ?? "SOMM"
                    } rewards earned and available to be claimed`}
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
                        <Text>
                          {cellarConfig?.customRewardWithoutAPY
                            ?.tokenSymbol ?? "SOMM"}{" "}
                          Rewards
                        </Text>
                        <InformationIcon
                          color="neutral.300"
                          boxSize={3}
                        />
                      </HStack>
                    </Th>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip
                    hasArrow
                    arrowShadowColor="purple.base"
                    label={
                      cellarConfig?.customRewardWithoutAPY
                        ?.customColumnHeaderToolTip
                    }
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
                        <Text>
                          {
                            cellarConfig?.customRewardWithoutAPY
                              ?.customColumnHeader
                          }
                        </Text>
                        <InformationIcon
                          color="neutral.300"
                          boxSize={3}
                        />
                      </HStack>
                    </Th>
                  </Tooltip>
                </>
              )}
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
                    <Td>
                      <HStack spacing={2}>
                        <Image
                          src={cellarConfig.lpToken.imagePath}
                          alt="lp token image"
                          height="20px"
                        />
                        <Text textAlign="right">
                          {toEther(amount.toFixed())}
                        </Text>
                      </HStack>
                    </Td>
                    {/* This handles edge case if users go outside of UI and us staking contract directly for a non ux lock period */}
                    <Td>
                      {(lockMap[lock] && lockMap[lock].title) ||
                        (Object.values(lockMap).length > 0 &&
                          Object.values(lockMap).slice(-1)[0].title)}
                    </Td>
                    <Td>
                      {/*!!!!!!!! TODO: this needs to be rewritten */}
                      {cellarConfig.customRewardWithoutAPY
                        ?.showRewards === true ||
                      cellarConfig.customRewardWithoutAPY ===
                        undefined ? (
                        <>
                          <HStack spacing={2}>
                            <Image
                              src={
                                cellarConfig?.customRewardWithoutAPY
                                  ?.imagePath ??
                                config.CONTRACT.SOMMELLIER.IMAGE_PATH
                              }
                              alt="reward token image"
                              height="20px"
                            />
                            <Text textAlign="right">
                              {claimAllRewards
                                ? toEther(
                                    claimAllRewards[i]?.toString() ||
                                      "0",
                                    6,
                                    false,
                                    2
                                  )
                                : "0.00"}
                            </Text>
                          </HStack>
                        </>
                      ) : (
                        <>
                          <HStack
                            as={Link}
                            href={`${cellarConfig?.customRewardWithoutAPY.customColumnValue}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Text
                              as="span"
                              fontWeight="bold"
                              fontSize={16}
                            >
                              {
                                cellarConfig?.customRewardWithoutAPY
                                  .customColumnValue
                              }
                            </Text>
                            <Icon
                              as={FaExternalLinkAlt}
                              color="purple.base"
                            />
                          </HStack>
                        </>
                      )}
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

      <Text fontSize="xs" textAlign="center" pt={4}>
        After triggering 'Unbond,' you will need to wait through the
        bonding period you selected,
        <br />
        after which your LP tokens can be unstaked and withdrawn.
      </Text>
    </InnerCard>
  )
}

export default BondingTableCard
