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
import { differenceInDays } from "date-fns"
import { FaExternalLinkAlt } from "react-icons/fa"
import { tokenConfig } from "data/tokenConfig"

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
    const unbondTime = new Date(unbondTimestamp * 1000)

    const differenceDays = differenceInDays(unbondTime, new Date())

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
          label="Days remaining until your tokens are available for withdrawal"
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <Text>
            LP Tokens Unlock in {differenceDays} day
            {differenceDays > 1 ? "s" : ""}
          </Text>
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
                      stakingEnd?.endDate,
                      { locale: { formatDistance } }
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
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Bonded LP Tokens
              </Th>
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Selected Unbonding Period
              </Th>
              {cellarConfig.customReward?.showBondingRewards ===
                true && (
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  {cellarConfig?.customReward?.tokenSymbol ?? "SOMM"}{" "}
                  Rewards
                </Th>
              )}
              {cellarConfig.customReward2?.showBondingRewards2 ===
                true && (
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  {cellarConfig?.customReward2?.tokenSymbol2 ??
                    "TEST"}{" "}
                  Rewards
                </Th>
              )}
              <Th />
            </Tr>
          </Thead>
          <Tbody fontWeight="bold">
            {userStakes &&
              userStakes.length > 0 &&
              userStakes.map((data, i) => {
                const { amount, lock, rewards, unbondTimestamp } =
                  data
                const lockMap = bondingPeriodOptions(cellarConfig)
                if (amount?.toString() === "0") return null
                return (
                  <Tr key={i}>
                    <Td>#{formatTrancheNumber(i + 1)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Image
                          src={cellarConfig.lpToken.imagePath}
                          alt="lp token image"
                          height="20px"
                        />
                        <Text textAlign="right">
                          {(
                            +Number(amount) /
                            10 ** cellarConfig.cellar.decimals
                          ).toLocaleString()}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      {(lockMap[lock] && lockMap[lock].title) ||
                        Object.values(lockMap).slice(-1)[0].title}
                    </Td>
                    {cellarConfig.customReward?.showBondingRewards ===
                      true && (
                      <Td>
                        <HStack spacing={2}>
                          <Image
                            src={
                              cellarConfig?.customReward?.imagePath ??
                              sommToken.src
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
                      </Td>
                    )}
                    {cellarConfig.customReward2
                      ?.showBondingRewards2 === true && (
                      <Td>
                        <HStack spacing={2}>
                          <Image
                            src={
                              cellarConfig?.customReward2
                                ?.imagePath2 ?? sommToken.src
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
                      </Td>
                    )}
                    <Td>
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
