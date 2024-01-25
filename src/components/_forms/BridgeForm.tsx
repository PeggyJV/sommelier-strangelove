import { Center, FormControl, Stack, Text } from "@chakra-ui/react"
import { Link } from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { SommReceivedInEth } from "components/_cards/BridgeCard/SommReceivedInEth"
import { ExternalLinkIcon, TimerIcon } from "components/_icons"
import { useAccount as useGrazAccount, useConnect as useGrazConnect } from "graz"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useBridgeEthToSommTx } from "hooks/web3/useBridgeEthToSommTx"
import { useBridgeSommToEthTx } from "hooks/web3/useBridgeSommToEthTx"
import React, { useEffect, VFC } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"
import { BridgeFormHeader } from "components/_cards/BridgeCard/BridgeFormHeader"
import { chainConfigMap, ChainType } from "data/chainConfig"
import { Address } from "components/_cards/BridgeCard/Address"
import { InputAddress } from "components/_cards/BridgeCard/InputAddress"

interface BridgeFormProps {
  wrongNetwork?: boolean
}

export const BridgeForm: VFC<BridgeFormProps> = ({wrongNetwork}) => {
  const { addToast, closeAll } = useBrandedToast()
  const isMounted = useIsMounted()
  const { watch, handleSubmit, formState, getFieldState, setValue } =
    useFormContext<BridgeFormValues>()

  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("address")

  const watchFrom = chainConfigMap[watch("from")]
  const watchTo = chainConfigMap[watch("to")]

  if (wrongNetwork === undefined) {
    wrongNetwork = false
  }

  useEffect(() => {
    setValue("address", "")
    setValue("amount", 0)
  }, [watchFrom, watchTo, setValue])

  const { isLoading: isEthToSommLoading, doEthToSomm } =
    useBridgeEthToSommTx()
  const { isLoading: isSommToEthLoading, doSommToEth } =
    useBridgeSommToEthTx()

  const decideTransactionType = () => {
    const fromChainType = watchFrom.type;
    const toChainType = watchTo.type;

    if(fromChainType === ChainType.Ethereum && toChainType === ChainType.Cosmos) {
      return doEthToSomm;
    }
    if(fromChainType === ChainType.Cosmos && toChainType === ChainType.Ethereum) {
      return doSommToEth;
    }
    if(fromChainType === ChainType.L2 && toChainType === ChainType.Ethereum) {
      return () => alert("L2 to Eth")
    }
    if(fromChainType === ChainType.Ethereum && toChainType === ChainType.L2) {
      return () => alert("Eth to L2 ")
    }
    if(fromChainType === ChainType.Cosmos && toChainType === ChainType.L2) {
      return () => alert("Cosmos to L2 ")
    }
    if(fromChainType === ChainType.L2 && toChainType === ChainType.Cosmos) {
      return () => alert("L2 to Cosmos ")
    }
    return () => alert("Error with transaction type")
  }

  const isLoading = isEthToSommLoading || isSommToEthLoading

  const isDisabled =
    isNaN(watchAmount) ||
    watchAmount <= 0 ||
    !!getFieldState("amount").error ||
    !!getFieldState("address").error ||
    !watchSommelierAddress ||
    isEthToSommLoading ||
    isSommToEthLoading || wrongNetwork

  const { connectAsync } = useGrazConnect()
  const { isConnected: isGrazConnected } = useGrazAccount()

  const { isConnected } = useAccount()

  // TODO: Check for L2 wallet connection
  const buttonEnabled =
    (isConnected && watchFrom.type === ChainType.Ethereum)
    || (isGrazConnected && watchFrom.type === ChainType.Cosmos)
    || watchFrom.type === ChainType.L2

  const getTransactionTime = () => {
    switch (watchFrom.type) {
      case ChainType.Ethereum:
        return "10-15";
      case ChainType.Cosmos:
        return "1-5";
      case ChainType.L2:
        return "TBA";
      default:
        return "10-15";
    }
  };

  return (
    <Stack  alignItems={"center"}>
      <Stack
        spacing="40px"
        as="form"
        onSubmit={
          handleSubmit(decideTransactionType())
        }
      >
        <Stack spacing={6}>
          <BridgeFormHeader isLoading={isLoading} from={watchFrom} to={watchTo}/>
          {buttonEnabled && !wrongNetwork && (
            <>
              <FormControl
                isInvalid={
                  formState.errors.amount as boolean | undefined
                }
              >
                <InputAmount />
              </FormControl>
              <Address chain={watchFrom}/>
              <FormControl
                isInvalid={
                  formState.errors.address as boolean | undefined
                }
              >
                <InputAddress chain={watchTo}/>
              </FormControl>
              {watchTo.type === ChainType.Ethereum && <SommReceivedInEth />}
            </>
          )}
        </Stack>
        {buttonEnabled && (
          <BaseButton
            disabled={isDisabled}
            isLoading={isLoading}
            type="submit"
            height="69px"
            fontSize="21px"
          >
            Bridge $SOMM
          </BaseButton>
        )}
      </Stack>
      {/*
          !!! TODO: This needs to be adjusted once it's modified for multichain
        */}
      {isMounted
          && !buttonEnabled
          && (watchFrom.type === ChainType.Ethereum
              || watchFrom.type === ChainType.L2)
          && (
        <ConnectButton
          overrideChainId={"ethereum"}
          unstyled
          height="69px"
          fontSize="21px"
        >
          Connect Sending Wallet
        </ConnectButton>
      )}
      {isMounted
          && !buttonEnabled
          && (watchFrom.type === ChainType.Cosmos)
          && (
        <BaseButton
          height="69px"
          fontSize="21px"
          onClick={async () => {
            try {
              await connectAsync()
            } catch (e) {
              const error = e as Error
              if (error.message === "Keplr is not defined") {
                return addToast({
                  heading: "Connect Keplr Wallet",
                  body: (
                    <>
                      <Text>Keplr not found</Text>
                      <Link
                        display="flex"
                        alignItems="center"
                        href="https://www.keplr.app/download"
                        isExternal
                      >
                        <Text as="span">Install Keplr</Text>
                        <ExternalLinkIcon ml={2} />
                      </Link>
                    </>
                  ),
                  status: "error",
                  closeHandler: closeAll,
                })
              }
              addToast({
                heading: "Connect Keplr Wallet",
                body: <Text>{error.message}</Text>,
                status: "error",
                closeHandler: closeAll,
              })
            }
          }}
        >
          Connect Keplr Wallet
        </BaseButton>
      )}

      <Center>
        <TimerIcon color="orange.base" boxSize="12px" mr="6px" />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="orange.light"
        >
          Transaction should process within{" "}
          {getTransactionTime()}{" "}
          minutes
        </Text>
      </Center>
    </Stack>
  )
}
