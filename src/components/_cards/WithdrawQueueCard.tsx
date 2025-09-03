import { useEffect, useMemo, useState } from "react"
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
  Link,
} from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { useHandleTransaction } from "hooks/web3"
import { InformationIcon } from "components/_icons"
import { InnerCard } from "./InnerCard"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useGeo } from "context/geoContext"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { formatUnits, getAddress, getContract } from "viem"
import { WithdrawQueueButton } from "components/_buttons/WithdrawQueueButton"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useBrandedToast } from "hooks/chakra"
import { WithdrawQueue } from "../../abi/types/WithdrawQueue"
import { useBoringQueueWithdrawals } from "data/hooks/useBoringQueueWithdrawals"
import { useCreateContracts } from "data/hooks/useCreateContracts"

function formatTimeRemaining(deadline: number): string {
  const deadlineInMs = deadline * 1000
  const now = new Date().getTime()
  const timeLeft = deadlineInMs - now

  if (timeLeft < 0) {
    return "Expired"
  }

  const seconds = Math.floor((timeLeft / 1000) % 60)
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))

  let timeString = ""
  if (days > 0) timeString += `${days}d `
  if (hours > 0) timeString += `${hours}h `
  if (minutes > 0) timeString += `${minutes}m `
  //if (seconds > 0) timeString += `${seconds}s`

  return timeString.trim()
}

const WithdrawQueueCard = (props: TableProps) => {
  const { addToast, closeAll } = useBrandedToast()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const { address } = useAccount()

  const { data: boringQueueWithdrawals } = useBoringQueueWithdrawals(
    cellarConfig.cellar.address,
    cellarConfig.chain.id,
    { enabled: !!cellarConfig.boringQueue }
  )

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const withdrawQueueContract = useMemo(() => {
    if (!publicClient) return
    return getContract({
      address: getAddress(cellarConfig.chain.withdrawQueueAddress),
      abi: WithdrawQueue,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })
  }, [
    publicClient,
    walletClient,
    cellarConfig.chain.withdrawQueueAddress,
  ])

  const { boringQueue } = useCreateContracts(cellarConfig)

  const [pendingWithdrawShares, setPendingWithdrawShares] =
    useState(0)
  const [pendingWithdrawSharePrice, setPendingWithdrawSharePrice] =
    useState(0)
  const [pendingWithdrawDeadline, setPendingWithdrawDeadline] =
    useState(0)

  // Check if a user has an active withdraw request
  const setWithdrawRequestData = async () => {
    try {
      if (
        walletClient &&
        withdrawQueueContract &&
        address &&
        cellarConfig &&
        !boringQueueWithdrawals
      ) {
        const withdrawRequest =
          await withdrawQueueContract?.read.getUserWithdrawRequest([
            address,
            cellarConfig.cellar.address as `0x${string}`,
          ])

        setPendingWithdrawShares(Number(withdrawRequest.sharesToWithdraw))
        setPendingWithdrawSharePrice(
          Number(
            formatUnits(
              withdrawRequest.executionSharePrice,
              cellarConfig.baseAsset.decimals
            )
          )
        )
        setPendingWithdrawDeadline(Number(withdrawRequest.deadline))
      } else if (boringQueueWithdrawals) {
        const request = boringQueueWithdrawals.open_requests[0].metadata

        setPendingWithdrawShares(Number(request.amountOfShares))
        setPendingWithdrawSharePrice(request.amountOfAssets / request.amountOfShares)
        setPendingWithdrawDeadline(request.creationTime + request.secondsToDeadline)
      } else {
        setPendingWithdrawShares(0)
        setPendingWithdrawSharePrice(0)
        setPendingWithdrawDeadline(0)
      }
    } catch (error) {
      console.log(error)
      setPendingWithdrawShares(0)
      setPendingWithdrawSharePrice(0)
      setPendingWithdrawDeadline(0)
    }
  }

  useEffect(() => {
    setWithdrawRequestData()
  }, [address, cellarConfig, boringQueueWithdrawals])

  const { doHandleTransaction } = useHandleTransaction()

  const geo = useGeo()

  const handleCancellation = async () => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }

    try {
      let hash;

      if (boringQueueWithdrawals) {
        const request =
          boringQueueWithdrawals.open_requests[0].metadata

        const withdrawTouple = [
          request.nonce,
          address,
          request.assetOut,
          request.amountOfShares,
          request.amountOfAssets,
          request.creationTime,
          request.secondsToMaturity,
          request.secondsToDeadline,
        ]
        const gasLimitEstimated = await estimateGasLimitWithRetry(
          boringQueue?.estimateGas.cancelOnChainWithdraw,
          boringQueue?.simulate.cancelOnChainWithdraw,
          [withdrawTouple],
          330000,
          address
        )
        // @ts-ignore
        hash = await boringQueue?.write.cancelOnChainWithdraw(
          [withdrawTouple],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      } else {
        const withdrawTouple = [0, 0, 0]

        const gasLimitEstimated = await estimateGasLimitWithRetry(
          withdrawQueueContract?.estimateGas.updateWithdrawRequest,
          withdrawQueueContract?.simulate.updateWithdrawRequest,
          [cellarConfig.cellar.address, withdrawTouple],
          330000,
          address
        )
        // @ts-ignore
        hash = await withdrawQueueContract?.write.updateWithdrawRequest(
          [cellarConfig.cellar.address, withdrawTouple],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      }
      

      const onSuccess = () => {
         // Can track here if we want
      }

      const onError = (error: Error) => {
        // Can track here if we want
      }

      await doHandleTransaction({
        cellarConfig,
        hash,
        onSuccess,
        onError,
      })
    } catch (e) {
      const error = e as Error

      if (error.message === "GAS_LIMIT_ERROR") {
        addToast({
          heading: "Transaction not submitted",
          body: (
            <Text>
              Your transaction has failed, if it does not work after
              waiting some time and retrying please send a message in
              our{" "}
              {
                <Link
                  href="https://discord.com/channels/814266181267619840/814279703622844426"
                  isExternal
                  textDecoration="underline"
                >
                  Discord Support channel
                </Link>
              }{" "}
              tagging a member of the front end team.
            </Text>
          ),
          status: "info",
          closeHandler: closeAll,
        })
      } else {
        console.error(error)
        addToast({
          heading: "Error cancelling withdraw request",
          body: <Text>Withdraw Queue Cancellation Aborted</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
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
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="Your active withdraw requests for this vault. Only 1 may be open at a time, per vault."
            placement="top"
            bg="surface.bg"
            color="neutral.300"
            textAlign={"center"}
          >
            <HStack spacing={2} align="center">
              <Heading fontSize="lg">
                Pending Withdraws in Queue
              </Heading>
              <InformationIcon color="neutral.300" boxSize={3.5} />
            </HStack>
          </Tooltip>
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
                Shares
              </Th>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="The target share price for this withdraw based on your previously selected share price discount at the time of your withdraw request submission."
                placement="top"
                bg="surface.bg"
                color="neutral.300"
                textAlign={"center"}
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text>Target Share Price</Text>
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
                label="The amount of time remaining for your withdraw request to be fulfilled. If this time expires with your request unfulfilled, your withdraw request will be cancelled."
                placement="top"
                bg="surface.bg"
                color="neutral.300"
                textAlign={"center"}
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text>Remaining Time to Fulfill</Text>
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
            <Tr
              key={0}
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
              <Td>
                <HStack spacing={2}>
                  <Image
                    src={cellarConfig.lpToken.imagePath}
                    alt="lp token image"
                    height="20px"
                  />
                  <Text textAlign="right">
                    {(
                      pendingWithdrawShares /
                      10 ** cellarConfig.cellar.decimals
                    ).toLocaleString()}
                  </Text>
                </HStack>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Text textAlign="right">
                    {pendingWithdrawSharePrice.toLocaleString()}
                  </Text>
                </HStack>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Text textAlign="right">
                    {formatTimeRemaining(pendingWithdrawDeadline)}
                  </Text>
                </HStack>
              </Td>
              <Td fontWeight="normal">
                <Flex justify="flex-end">
                  <HStack spacing={2}>
                    <WithdrawQueueButton
                      size="sm"
                      chain={cellarConfig.chain}
                      buttonLabel="Replace Withdraw Request"
                      onSuccessfulWithdraw={setWithdrawRequestData}
                    />
                    <SecondaryButton
                      size="sm"
                      onClick={() => {
                        // Submit Cancel
                        handleCancellation()

                        // Refresh Data
                        setWithdrawRequestData()
                      }}
                    >
                      Cancel Request
                    </SecondaryButton>
                  </HStack>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </InnerCard>
  )
}

export default WithdrawQueueCard
