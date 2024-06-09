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
  Link,
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
import { FaExternalLinkAlt } from "react-icons/fa"
import { tokenConfig } from "data/tokenConfig"
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns"

// TODO: This file has incurred substantial tech debt, it just needs to be rewritten from scratch at this point

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
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const {
    data: userData,
    isLoading,
    refetch,
  } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const { stakerSigner } = useCreateContracts(cellarConfig)
  const [unbondLoading, setUnbondLoading] = useState<Set<number>>(
    new Set()
  )
  const [unstakeLoading, setUnstakeLoading] = useState<Set<number>>(
    new Set()
  )

  const sommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" &&
      token.chain === cellarConfig.chain.id
  )!

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
      // analytics.track("unstake.started")
      const tx = await stakerSigner?.unstake(id)

      await doHandleTransaction({
        cellarConfig,
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
      // analytics.track("unbond.started")
      const tx = await stakerSigner?.unbond(id, {
        // gas used around 63000
        //gasLimit: 100000,
      })

      await doHandleTransaction({
        cellarConfig,
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
    const now = new Date()
    const unbondTime = new Date(unbondTimestamp * 1000)

    // Calculate the difference in days, hours, and minutes
    const differenceDays = differenceInDays(unbondTime, now)
    const differenceHours = differenceInHours(unbondTime, now) % 24
    const differenceMinutes =
      differenceInMinutes(unbondTime, now) % 60

    // Always format the string to display days, hours, and minutes
    const timeRemaining = `${differenceDays} day${
      differenceDays !== 1 ? "s" : ""
    }, ${differenceHours} hour${
      differenceHours !== 1 ? "s" : ""
    }, and ${differenceMinutes} minute${
      differenceMinutes !== 1 ? "s" : ""
    }`

    const canUnstake =
      unbondTimestamp * 1000 < Date.now() &&
      unbondTimestamp.toString() !== "0"

    if (canUnstake)
      return (
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="Click to initiate a transaction that will transfer your LP tokens from the bonding contract directly to your wallet"
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <SecondaryButton
            isLoading={unstakeLoading.has(i)}
            disabled={unstakeLoading.has(i)}
            size="sm"
            onClick={() => handleUnstake(i)}
          >
            Withdraw LP Tokens
          </SecondaryButton>
        </Tooltip>
      )

    if (unbondTimestamp.toString() === "0") {
      return (
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="Click to initiate the unbonding process. After clicking, the countdown will begin based on the unbonding period you've selected. Once the countdown ends, your tokens will be unlocked and available for withdrawal"
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <SecondaryButton
            isLoading={unbondLoading.has(i)}
            disabled={unbondLoading.has(i)}
            size="sm"
            onClick={() => handleUnBond(i)}
          >
            Start Unbond
          </SecondaryButton>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="Time remaining until your tokens are available for withdrawal"
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <Text>LP Tokens Unlock in {timeRemaining}</Text>
        </Tooltip>
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
                      cellarConfig.customReward
                        ?.stakingDurationOverride ??
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
                label="Bonded LP tokens earn yield from the vault and liquidity mining rewards"
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
                    <Text>Bonded LP Tokens</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="This is the period you must wait before your tokens are transferable/withdrawable"
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
                    <Text>Selected Unbonding Period</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              {cellarConfig.customReward?.showBondingRewards ===
              true ? (
                <Tooltip
                  hasArrow
                  arrowShadowColor="purple.base"
                  label={`Amount of ${
                    cellarConfig?.customReward?.tokenSymbol ?? "SOMM"
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
                        {cellarConfig?.customReward?.tokenSymbol ??
                          "SOMM"}{" "}
                        Rewards
                      </Text>
                      <InformationIcon
                        color="neutral.300"
                        boxSize={3}
                      />
                    </HStack>
                  </Th>
                </Tooltip>
              ) : null}
              {cellarConfig.customReward?.showSommRewards === true ||
              cellarConfig.customReward?.showSommRewards ===
                undefined ? (
                <>
                  <Tooltip
                    hasArrow
                    arrowShadowColor="purple.base"
                    label={`Amount of SOMM rewards earned and available to be claimed`}
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
                </>
              ) : null}
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
                          {(+(
                            Number(amount) /
                            10 ** cellarConfig.cellar.decimals
                          ).toPrecision(2)).toLocaleString()}
                        </Text>
                      </HStack>
                    </Td>
                    {/* This handles edge case if users go outside of UI and us staking contract directly for a non ux lock period */}
                    <Td>
                      {(lockMap[lock] && lockMap[lock].title) ||
                        (Object.values(lockMap).length > 0 &&
                          Object.values(lockMap).slice(-1)[0].title)}
                    </Td>
                    {cellarConfig.customReward?.showBondingRewards ===
                    true ? (
                      <Td>
                        {/*!!!!!!!! TODO: this needs to be rewritten */}
                        {!cellarConfig.customReward
                          ?.customColumnValue ? (
                          <>
                            <HStack spacing={2}>
                              <Image
                                src={
                                  cellarConfig?.customReward
                                    ?.imagePath ?? sommToken.src
                                }
                                alt="reward token image"
                                height="20px"
                              />
                              <Text textAlign="right">
                                {claimAllRewards
                                  ? Number(
                                      toEther(
                                        claimAllRewards[
                                          i
                                        ] || "0",
                                        6,
                                        false,
                                        2
                                      )
                                    ).toLocaleString()
                                  : "0.00"}
                              </Text>
                            </HStack>
                          </>
                        ) : (
                          <>
                            <HStack
                              as={Link}
                              href={`${cellarConfig?.customReward?.customColumnValue}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Text
                                as="span"
                                fontWeight="bold"
                                fontSize={16}
                              >
                                {
                                  cellarConfig?.customReward
                                    ?.customColumnValue
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
                    ) : null}
                    <Td>
                      {/*!!!!!!!! TODO: this needs to be rewritten */}
                      {cellarConfig.customReward?.showSommRewards ||
                      cellarConfig.customReward?.showSommRewards ===
                        undefined ? (
                        <>
                          <HStack spacing={2}>
                            <Image
                              src={sommToken.src}
                              alt="reward token image"
                              height="20px"
                            />
                            <Text textAlign="right">
                              {claimAllRewards
                                ? toEther(
                                    claimAllRewards[i] ||
                                      "0",
                                    6,
                                    false,
                                    2
                                  )
                                : "0.00"}
                            </Text>
                          </HStack>
                        </>
                      ) : null}
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
      {/* <Text fontSize="xs" textAlign="center" pt={4}>
        After triggering 'Unbond,' you will need to wait through the
        unbonding period you selected,
        <br />
        after which your LP tokens can be unstaked and withdrawn.
      </Text> */}
    </InnerCard>
  )
}

export default BondingTableCard
