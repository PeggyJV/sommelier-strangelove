import {
  Center,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Image,
  Stack,
  Text
} from "@chakra-ui/react"
import { Link} from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import ConnectButton from "components/_buttons/ConnectButton"
import {BridgeFormValues } from "components/_cards/BridgeCard"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputEthereumAddress } from "components/_cards/BridgeCard/InputEthereumAddress"
import { InputSommelierAddress } from "components/_cards/BridgeCard/InputSommelierAddress"
import { SommelierAddress } from "components/_cards/BridgeCard/SommelierAddress"
import { SommReceivedInEth } from "components/_cards/BridgeCard/SommReceivedInEth"
import { ExternalLinkIcon, TimerIcon } from "components/_icons"
import { useAccount as useGrazAccount, useConnect as useGrazConnect,} from "graz"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useBridgeEthToSommTx } from "hooks/web3/useBridgeEthToSommTx"
import { useBridgeSommToEthTx } from "hooks/web3/useBridgeSommToEthTx"
import React, { useEffect, VFC } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"
import { ChainSelector } from "components/ChainSelector";
import {
  chainConfig,
  chainConfigMap,
  chainSlugMap,
  ChainType
} from "data/chainConfig";

interface BridgeFormProps {
  wrongNetwork?: boolean
}

export const BridgeForm: VFC<BridgeFormProps> = ({wrongNetwork}) => {
  const { addToast, closeAll } = useBrandedToast()
  const isMounted = useIsMounted()
  const { watch, handleSubmit, formState, getFieldState, register, setValue } =
    useFormContext<BridgeFormValues>()

  const watchType = watch("type")
  const toSomm = watchType === "TO_SOMMELIER"
  const toEth = watchType === "TO_ETHEREUM"
  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("address")

  const from = chainConfigMap[watch("from").toLowerCase()]
  const to = chainConfigMap[watch("to").toLowerCase()]

  if (wrongNetwork === undefined) {
    wrongNetwork = false
  }

  useEffect(() => {
    setValue("address", "")
    setValue("amount", 0)
  }, [watchType, setValue])

  const { isLoading: isEthToSommLoading, doEthToSomm } =
    useBridgeEthToSommTx()
  const { isLoading: isSommToEthLoading, doSommToEth } =
    useBridgeSommToEthTx()

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
    (isConnected && toSomm) || (isGrazConnected && toEth)

  const getTextForChosenChains = () => {
    const fromChainType = chainConfigMap[watch("from").toLowerCase()].type;
    const toChainType = chainConfigMap[watch("to").toLowerCase()].type;

    if((fromChainType === ChainType.Ethereum && toChainType === ChainType.Cosmos)
        || (fromChainType === ChainType.Cosmos && toChainType === ChainType.Ethereum)) {
      return " Bridge your Ethereum SOMM back home to its native Cosmos\n" +
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
          watchType === "TO_SOMMELIER"
            ? handleSubmit(doEthToSomm)
            : handleSubmit(doSommToEth)
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
              {watchType === "TO_SOMMELIER" ? (
                <EthereumAddress />
              ) : (
                <SommelierAddress />
              )}
              <FormControl
                isInvalid={
                  formState.errors.address as boolean | undefined
                }
              >
                {watchType === "TO_SOMMELIER" ? (
                  <InputSommelierAddress />
                ) : (
                  <InputEthereumAddress />
                )}
              </FormControl>
              {watchType === "TO_ETHEREUM" && <SommReceivedInEth />}
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
          && (from.type === ChainType.Ethereum
              || from.type === ChainType.L2)
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
          && (from.type === ChainType.Cosmos)
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
          {watchType === "TO_SOMMELIER" ? "10-15" : "1-5"} minutes.
        </Text>
      </Center>
    </Stack>
  )
}
