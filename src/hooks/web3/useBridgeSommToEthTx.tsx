import { BridgeFormValues } from "components/_cards/BridgeCard"
import { useBrandedToast } from "hooks/chakra"
import { useState } from "react"
import { HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import truncateWalletAddress from "utils/truncateWalletAddress"
import { AiFillCopy } from "react-icons/ai"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useAccount, useSigners } from "graz"
import { txClient } from "src/vendor/ignite/gravity.v1"
import { ethers } from "ethers"
import { useImportToken } from "hooks/web3/useImportToken"

export const useBridgeSommToEthTx = () => {
  const { addToast, update, closeAll } = useBrandedToast()
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useAccount()
  const { signerAmino } = useSigners()

  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to MetaMask</Text>,
        closeHandler: closeAll,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: closeAll,
      })
    },
  })
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

  const doSommToEth = async (props: BridgeFormValues) => {
    try {
      setIsLoading(true)
      addToast({
        heading: "Loading",
        status: "default",
        body: <Text>Transaction in progress</Text>,
        isLoading: true,
        duration: null,
        closeHandler: closeAll,
      })
      if (data?.bech32Address === undefined) {
        throw new Error("No Connected Cosmos wallet")
      }

      const amountReceived = props.amount - 50
      const convertedAmount = ethers.utils.parseUnits(
        String(amountReceived),
        6
      )

      analytics.track("bridge.contract-started", {
        value: props.amount,
        path: "sommToEth",
        sender: data?.bech32Address,
        receiver: props.address,
      })

      const res = await txClient({
        signer: signerAmino || undefined,
        addr: "https://sommelier-rpc.polkachu.com/",
        prefix: "somm",
      }).sendMsgSendToEthereum({
        value: {
          ethereumRecipient: props.address,
          amount: {
            amount: String(convertedAmount),
            denom: "usomm",
          },
          sender: data?.bech32Address,
          bridgeFee: {
            amount: "50000000",
            denom: "usomm",
          },
        },
      })

      if (res.transactionHash && res.code === 0) {
        analytics.track("bridge.contract-succeeded", {
          value: props.amount,
          path: "sommToEth",
          sender: data?.bech32Address,
          receiver: props.address,
          txHash: res.transactionHash,
        })

        update({
          heading: "Bridge Initiated",
          body: (
            <Stack>
              <Stack spacing={0} fontSize="xs">
                <HStack>
                  <Text as="span" fontWeight="bold">
                    Amount:
                  </Text>
                  <Text as="span">{props.amount} SOMM</Text>
                </HStack>
                <HStack>
                  <Text as="span" fontWeight="bold">
                    Destination:
                  </Text>
                  <Text as="span">Sommelier to Ethereum Mainnet</Text>
                </HStack>
                <HStack>
                  <Text as="span" fontWeight="bold" width="15ch">
                    Est. time:
                  </Text>
                  <Text as="span">
                    1-5 min. Transaction may take additional time to
                    process after network validation
                  </Text>
                </HStack>
              </Stack>
              <Link
                fontSize="sm"
                href={`https://www.mintscan.io/sommelier/txs/${res.transactionHash}`}
                target="_blank"
                textDecor="underline"
              >
                <HStack>
                  <Text>View on Mintscan</Text>
                  <ExternalLinkIcon boxSize={3} />
                </HStack>
              </Link>
            </Stack>
          ),
          status: "primary",
          duration: null,
          closeHandler: closeAll,
        })

        // Trigger the import token functionality
        importToken.mutate({
          address: "0xa670d7237398238de01267472c6f13e5b8010fd1",
        })
      } else if (res.code !== 0) {
        analytics.track("bridge.contract-failed", {
          value: props.amount,
          path: "sommToEth",
          sender: data?.bech32Address,
          receiver: props.address,
          txHash: res.transactionHash,
        })

        setIsLoading(false)
        return update({
          heading: "Bridge Initiated",
          body: (
            <Stack>
              <Stack spacing={0} fontSize="xs">
                <HStack>
                  <Text fontWeight="bold">
                    Tx Hash:{" "}
                    {truncateWalletAddress(res.transactionHash)}{" "}
                  </Text>
                  <CopyTxHashButton hash={res.transactionHash} />
                </HStack>
              </Stack>
              <Link
                fontSize="sm"
                href={`https://www.mintscan.io/sommelier/txs/${res.transactionHash}`}
                target="_blank"
                textDecor="underline"
              >
                <HStack>
                  <Text>View on Mintscan</Text>
                  <ExternalLinkIcon boxSize={3} />
                </HStack>
              </Link>
            </Stack>
          ),
          status: "error",
          duration: null,
          closeHandler: closeAll,
        })
      }

      setIsLoading(false)
    } catch (e) {
      analytics.track("bridge.failed", {
        value: props.amount,
        path: "sommToEth",
        sender: data?.bech32Address,
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

  return { isLoading, doSommToEth }
}
