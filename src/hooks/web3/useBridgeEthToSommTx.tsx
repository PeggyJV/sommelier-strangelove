import { BridgeFormValues } from "components/_cards/BridgeCard"
import { useBrandedToast } from "hooks/chakra"
import { useState } from "react"
import { config } from "utils/config"
import { useAccount, useContract, useSigner } from "wagmi"
import { HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import truncateWalletAddress from "utils/truncateWalletAddress"
import { AiFillCopy } from "react-icons/ai"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import { ethers } from "ethers"
import { getBytes32 } from "utils/getBytes32"
import { GravityBridge } from "src/abi/types"
import { analytics } from "utils/analytics"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { getAddress } from "ethers/lib/utils.js"
import { useNetwork } from "wagmi"

export const useBridgeEthToSommTx = () => {
  const { CONTRACT } = config
  // Currently `close` have a bug it only closes the last toast appeared
  // TODO: Fix `close` and implement it here https://github.com/strangelove-ventures/sommelier/issues/431
  const { addToast, update, closeAll } = useBrandedToast()
  const [isLoading, setIsLoading] = useState(false)
  const { chain } = useNetwork()
  const { data: signer } = useSigner()
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })
  const { address } = useAccount()

  const erc20Contract = useContract({
    address: CONTRACT.SOMMELLIER.ADDRESS,
    abi: CONTRACT.SOMMELLIER.ABI,
    signerOrProvider: signer,
  })!

  const bridgeContract = useContract({
    address: CONTRACT.BRIDGE.ADDRESS,
    abi: CONTRACT.BRIDGE.ABI,
    signerOrProvider: signer,
  })!

  const TxHashToastBody = ({
    title,
    hash,
  }: {
    title: string
    hash: string
  }) => (
    <Stack>
      <Stack spacing={0} fontSize="xs">
        <Text>{title}</Text>
        <HStack>
          <Text fontWeight="bold">
            Tx Hash: {truncateWalletAddress(hash)}{" "}
          </Text>
          <CopyTxHashButton hash={hash} />
        </HStack>
      </Stack>

      <Link
        fontSize="sm"
        href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
        target="_blank"
        textDecor="underline"
      >
        <HStack>
          <Text>{`View on ${chain?.blockExplorers?.default.name}`}</Text>
          <ExternalLinkIcon boxSize={3} />
        </HStack>
      </Link>
    </Stack>
  )

  const BridgeTxHashToastBody = ({
    hash,
    amount,
  }: {
    hash: string
    amount: string
  }) => (
    <Stack>
      <Stack spacing={0} fontSize="xs">
        <HStack>
          <Text as="span" fontWeight="bold">
            Amount:
          </Text>
          <Text as="span">{amount} SOMM</Text>
        </HStack>
        <HStack>
          <Text as="span" fontWeight="bold">
            Destination:
          </Text>
          <Text as="span">Ethereum Mainnet to Sommelier</Text>
        </HStack>
        <HStack>
          <Text as="span" fontWeight="bold" width="15ch">
            Est. time:
          </Text>
          <Text as="span">
            10-15 min. Transaction may take additional time to process
            after network validation
          </Text>
        </HStack>
      </Stack>
      <Link
        fontSize="sm"
        href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
        target="_blank"
        textDecor="underline"
      >
        <HStack>
          <Text>{`View on ${chain?.blockExplorers?.default.name}`}</Text>
          <ExternalLinkIcon boxSize={3} />
        </HStack>
      </Link>
    </Stack>
  )

  const CopyTxHashButton = ({ hash }: { hash: string }) => (
    <IconButton
      onClick={() => {
        navigator.clipboard.writeText(hash)
        addToast({
          heading: "Copied to clipboard",
          body: null,
          status: "success",
          duration: null,
          closeHandler: closeAll,
        })
      }}
      aria-label="Copy to clipboard"
      icon={<AiFillCopy />}
    />
  )

  const doEthToSomm = async (props: BridgeFormValues) => {
    try {
      setIsLoading(true)
      const convertedAmount = ethers.utils.parseUnits(
        String(props.amount),
        CONTRACT.SOMMELLIER.DECIMALS
      )
      // analytics.track("bridge.approval-required", {
      //   value: props.amount,
      //   path: "ethToSomm",
      //   sender: address,
      //   receiver: props.address,
      // })

      // Check if approval needed
      const allowance = await erc20Contract.allowance(
        address!,
        getAddress(CONTRACT.BRIDGE.ADDRESS)
      )
      const needsApproval = allowance.lt(convertedAmount)

      if (needsApproval) {
        addToast({
          heading: "Loading",
          status: "default",
          body: <Text>Approval in progress</Text>,
          isLoading: true,
          duration: null,
          closeHandler: closeAll,
        })

        // ERC20 Approval
        const { hash: erc20Hash } = await erc20Contract.approve(
          getAddress(CONTRACT.BRIDGE.ADDRESS),
          ethers.constants.MaxUint256
        )
        const waitForApproval = wait({
          hash: erc20Hash,
        })
        const resultApproval = await waitForApproval
        if (resultApproval.data?.status !== 1) {
          // analytics.track("bridge.approval-failed", {
          //   value: props.amount,
          // })
          setIsLoading(false)
          return update({
            heading: "ERC20 Approval",
            body: (
              <TxHashToastBody
                title="Contract failed"
                hash={erc20Hash}
              />
            ),
            status: "error",
            duration: null,
            closeHandler: closeAll,
          })
        }
        if (
          resultApproval?.data?.transactionHash &&
          resultApproval.data?.status === 1
        ) {
          // analytics.track("bridge.approval-succeeded", {
          //   value: props.amount,
          //   path: "ethToSomm",
          //   sender: address,
          //   receiver: props.address,
          // })
          update({
            heading: "ERC20 Approval",
            body: (
              <TxHashToastBody title="Approved" hash={erc20Hash} />
            ),
            status: "primary",
            duration: null,
            closeHandler: closeAll,
          })
        }
      }

      // analytics.track("bridge.contract-started", {
      //   value: props.amount,
      //   path: "ethToSomm",
      //   sender: address,
      //   receiver: props.address,
      // })
      // Bridge transaction
      addToast({
        heading: "Loading",
        status: "default",
        body: <Text>Transaction in progress</Text>,
        isLoading: true,
        duration: null,
        closeHandler: closeAll,
      })
      const bytes32 = getBytes32(props.address)
      const { hash: bridgeHash } = await bridgeContract.sendToCosmos(
        CONTRACT.SOMMELLIER.ADDRESS,
        bytes32,
        convertedAmount
      )
      const waitForBridge = wait({
        hash: bridgeHash,
      })
      const resultBridge = await waitForBridge
      if (resultBridge.data?.status !== 1) {
        analytics.track("bridge.contract-failed", {
          value: props.amount,
          path: "ethToSomm",
          sender: address,
          receiver: props.address,
          txHash: resultBridge.data?.transactionHash,
        })
        setIsLoading(false)
        return update({
          heading: "Bridge Initiated",
          body: (
            <TxHashToastBody
              title="Contract Failed"
              hash={bridgeHash}
            />
          ),
          status: "error",
          duration: null,
          closeHandler: closeAll,
        })
      }
      if (
        resultBridge?.data?.transactionHash &&
        resultBridge.data?.status === 1
      ) {
        analytics.track("bridge.contract-succeeded", {
          value: props.amount,
          path: "ethToSomm",
          sender: address,
          receiver: props.address,
          txHash: resultBridge.data?.transactionHash,
        })
        update({
          heading: "Bridge Initiated",
          body: (
            <BridgeTxHashToastBody
              amount={String(props.amount)}
              hash={bridgeHash}
            />
          ),
          status: "primary",
          duration: null,
          closeHandler: closeAll,
        })
      }
      setIsLoading(false)
    } catch (e) {
      analytics.track("bridge.failed", {
        value: props.amount,
        path: "ethToSomm",
        sender: address,
        receiver: props.address,
      })
      const error = e as Error
      setIsLoading(false)
      update({
        heading: "Error",
        body: <Text>{error.message}</Text>,
        status: "error",
        closeHandler: closeAll,
      })
    }
  }

  return { isLoading, doEthToSomm }
}
