import { Center, Flex, FormControl, HStack, IconButton, Image, Stack, Text } from "@chakra-ui/react"
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
import { ChainSelector } from "components/ChainSelector"
import { chainConfig, chainConfigMap, chainSlugMap, ChainType } from "data/chainConfig"
import { Address } from "components/_cards/BridgeCard/Address"
import { AddressInput } from "components/_cards/BridgeCard/AddressInput"

interface BridgeFormProps {
  wrongNetwork?: boolean
}

export const BridgeForm: VFC<BridgeFormProps> = ({wrongNetwork}) => {
  const { addToast, closeAll } = useBrandedToast()
  const isMounted = useIsMounted()
  const { watch, handleSubmit, formState, getFieldState, register, setValue } =
    useFormContext<BridgeFormValues>()

  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("address")

  const watchFrom = chainConfigMap[watch("from").toLowerCase()]
  const watchTo = chainConfigMap[watch("to").toLowerCase()]

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
      return useBridgeEthToSommTx;
    }
    if(fromChainType === ChainType.Cosmos && toChainType === ChainType.Ethereum) {
      return useBridgeSommToEthTx;
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

  const buttonEnabled =
    (isConnected && watchFrom.type === ChainType.Ethereum) || (isGrazConnected && watchFrom.type === ChainType.Cosmos)

  const getTextForChosenChains = () => {
    const fromChainType = watchFrom.type;
    const toChainType = watchTo.type;

    if(fromChainType === toChainType){
      return "Not a valid bridge."
    }
    if((fromChainType === ChainType.Ethereum && toChainType === ChainType.Cosmos)
        || (fromChainType === ChainType.Cosmos && toChainType === ChainType.Ethereum)) {
      return "Bridge your Ethereum SOMM back home to its native Cosmos\n" +
          "representation on Sommelier or from Sommelier to Ethereum. "
    }
    if((fromChainType === ChainType.L2 && toChainType === ChainType.Cosmos)
        || (fromChainType === ChainType.Cosmos && toChainType === ChainType.L2)) {
      return "Bridge from Ethereum <> Cosmos or from an L2 <> Cosmos"
    }
    if((fromChainType === ChainType.Ethereum && toChainType === ChainType.L2)
        || (fromChainType === ChainType.L2 && toChainType === ChainType.Ethereum)) {
      return "Bridge from Ethereum <> Cosmos, L2 <> Cosmos or from an Ethereum <> L2"
    }
  }
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
    <Stack spacing="40px" alignItems={"center"}>
      <Text fontSize="md" mb="41px">
        {getTextForChosenChains()}
        <Link
            ml={1}
            fontSize="xs"
            fontWeight="semibold"
            textDecoration="underline"
            href="https://www.notion.so/Bridge-UI-88307640a6ab4f649b6a0b3cb6cb4d34"
            target="_blank"
        >
          Read More{" "}
          <ExternalLinkIcon boxSize={3} color="purple.base" />
        </Link>
      </Text>
      <Stack
        spacing="40px"
        as="form"
        onSubmit={
          handleSubmit(decideTransactionType())
        }
      >
        <Stack spacing={6}>
          <HStack justifyContent="space-between">
            <Stack flex={1}>

            <FormControl>
              <ChainSelector
                  chains={chainConfig.map(chain => chain.displayName)}
                  defaultValue={chainSlugMap.ETHEREUM.displayName}
                  direction="From"
                  register={register("from", { required: "Please select a chain" })}
              />

            </FormControl>
            </Stack>

            <Flex
              justifyContent={"center"}
              alignSelf="flex-end"
              pb={2}
            >
              <IconButton
                aria-label="swap icon"
                variant="unstyled"
                size="sm"
                icon={
                  <Image
                    src="/assets/images/swap.svg"
                    alt="swap icon"
                  />
                }
                disabled={isLoading}
                onClick={() => {
                  const fromValue = watch("from");
                  const toValue = watch("to");

                  setValue("to", fromValue);
                  setValue("from", toValue);
                }
                }
              />
            </Flex>
            <Stack flex={1}>
              <FormControl>
                <ChainSelector
                    chains={chainConfig.map(chain => chain.displayName)}
                    defaultValue={chainSlugMap.ARBITRUM.displayName}
                    direction="To"
                    register={register("to", { required: "Please select a chain" })}
                />

              </FormControl>
            </Stack>
          </HStack>
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
                <AddressInput chain={watchTo}/>
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
