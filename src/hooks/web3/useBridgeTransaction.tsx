import { BridgeFormValues } from "components/_cards/BridgeCard"
import { useBrandedToast } from "hooks/chakra"
import { useState } from "react"
import { config } from "utils/config"
import { useWaitForTransaction, useContract, useSigner } from "wagmi"
import { HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import truncateWalletAddress from "utils/truncateWalletAddress"
import { AiFillCopy } from "react-icons/ai"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import { ethers } from "ethers"
import { getBytes32 } from "utils/getBytes32"
import { GravityBridge } from "src/abi/types"

export const useBridgeTransaction = () => {
  const { CONTRACT } = config
  // Currently `close` have a bug it only closes the last toast appeared
  // TODO: Fix `close` and implement it here https://github.com/strangelove-ventures/sommelier/issues/431
  const { addToast, update, closeAll } = useBrandedToast()
  const [isLoading, setIsLoading] = useState(false)

  const [{ data: signer }] = useSigner()
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const erc20Contract = useContract({
    addressOrName: CONTRACT.SOMMELLIER.ADDRESS,
    contractInterface: CONTRACT.SOMMELLIER.ABI,
    signerOrProvider: signer,
  })

  const bridgeContract: GravityBridge = useContract({
    addressOrName: CONTRACT.BRIDGE.ADDRESS,
    contractInterface: CONTRACT.BRIDGE.ABI,
    signerOrProvider: signer,
  })

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
        href={`https://etherscan.io/tx/${hash}`}
        target="_blank"
        textDecor="underline"
      >
        <HStack>
          <Text>View on Etherscan</Text>
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
          <Text as="span">Ethereum Mainnet to Cosmos</Text>
        </HStack>
        <HStack>
          <Text as="span" fontWeight="bold" width="15ch">
            Est. time:
          </Text>
          <Text as="span">
            10-30 min. Transaction may take additional time to process
            after network validation
          </Text>
        </HStack>
      </Stack>
      <Link
        fontSize="sm"
        href={`https://etherscan.io/tx/${hash}`}
        target="_blank"
        textDecor="underline"
      >
        <HStack>
          <Text>View on Etherscan</Text>
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

  const doTransaction = async (props: BridgeFormValues) => {
    try {
      setIsLoading(true)
      addToast({
        heading: "Loading",
        status: "default",
        body: <Text>Approval in progress</Text>,
        isLoading: true,
        duration: null,
        closeHandler: closeAll,
      })
      const convertedAmount = ethers.utils.parseUnits(
        String(props.amount),
        CONTRACT.SOMMELLIER.DECIMALS
      )
      // ERC20 Approval
      const { hash: erc20Hash } = await erc20Contract.approve(
        CONTRACT.BRIDGE.ADDRESS,
        convertedAmount
      )
      const waitForApproval = wait({
        hash: erc20Hash,
      })
      const resultApproval = await waitForApproval
      if (resultApproval.data?.status !== 1) {
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
        update({
          heading: "ERC20 Approval",
          body: <TxHashToastBody title="Approved" hash={erc20Hash} />,
          status: "primary",
          duration: null,
          closeHandler: closeAll,
        })
      }
      // Bridge transaction
      addToast({
        heading: "Loading",
        status: "default",
        body: <Text>Transaction in progress</Text>,
        isLoading: true,
        duration: null,
        closeHandler: closeAll,
      })
      const bytes32 = getBytes32(props.sommelierAddress)
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

  return { isLoading, doTransaction }
}
