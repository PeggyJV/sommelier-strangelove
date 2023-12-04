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
import { Text } from "@chakra-ui/react"
import { config } from "utils/config"

export const useBridgeSommToEthTx = () => {
  const { addToast, update, closeAll } = useBrandedToast()
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useAccount()
  const { signerAmino } = useSigners()

  const importToken = useImportToken()

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
          heading: "Transaction Failed",
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
            <>
              <BridgeTxHashToastBody
                amount={String(props.amount)}
                hash={res.transactionHash}
                addToast={addToast}
                closeAll={closeAll}
              />
              <Text
                as="button"
                fontWeight="bold"
                fontSize="sm"
                textDecoration="underline"
                color="white"
                display="block"
                mt={3}
                onClick={() => {
                  const fullImageUrl = `${window.origin}${config.CONTRACT.SOMMELLIER.IMAGE_PATH}`;
                  importToken.mutate({
                    address: config.CONTRACT.SOMMELLIER.ADDRESS,
                    imageUrl: fullImageUrl,
                  });
                }}
              >
                Import SOMM tokens to wallet
              </Text>
            </>
          ),
          status: "primary",
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

      update({
        heading: "Error",
        body: <Text>{error.message}</Text>,
        status: "error",
        closeHandler: closeAll,
      })

      setIsLoading(false)
    }
  }

  return { isLoading, doSommToEth }
}
