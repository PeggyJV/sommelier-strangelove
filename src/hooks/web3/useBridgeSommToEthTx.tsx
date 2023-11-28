import { useState } from "react"
import { useBrandedToast } from "hooks/chakra"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { ethers } from "ethers"
import { useAccount, useSigners } from "graz"
import { txClient } from "src/vendor/ignite/gravity.v1"
import { analytics } from "utils/analytics"
import {
  TxHashToastBody,
  BridgeTxHashToastBody,
} from "./ReusableToastBodies"
import { useImportToken } from "hooks/web3/useImportToken"
import { Text, Button } from "@chakra-ui/react"

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

      if (res.code !== 0) {
        analytics.track("bridge.contract-failed", {
          value: props.amount,
          path: "sommToEth",
          sender: data?.bech32Address,
          receiver: props.address,
          txHash: res.transactionHash,
        })

        update({
          heading: "Bridge Initiated",
          body: (
            <TxHashToastBody
              title="Transaction Failed"
              hash={res.transactionHash}
              addToast={addToast}
              closeAll={closeAll}
            />
          ),
          status: "error",
          duration: null,
          closeHandler: closeAll,
        })

        setIsLoading(false)
        return
      }

      if (res.transactionHash) {
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
            <BridgeTxHashToastBody
              amount={String(props.amount)}
              hash={res.transactionHash}
              addToast={addToast}
              closeAll={closeAll}
            />
          ),
          status: "primary",
          duration: null,
          closeHandler: closeAll,
        })

        // Toast for token import
        addToast({
          heading: "Bridge Successful",
          status: "success",
          body: (
            <>
              <Text>
                Would you like to import the SOMM token to MetaMask?
              </Text>
              <Button
                colorScheme="purple"
                mt={3}
                onClick={() =>
                  importToken.mutate({
                    address:
                      "0xa670d7237398238de01267472c6f13e5b8010fd1",
                  })
                }
              >
                Import to MetaMask
              </Button>
            </>
          ),
          duration: null,
          closeHandler: closeAll,
        })
      }

      setIsLoading(false)
    } catch (e) {
      const error = e as Error
      analytics.track("bridge.failed", {
        value: props.amount,
        path: "sommToEth",
        sender: data?.bech32Address,
        receiver: props.address,
      })

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
