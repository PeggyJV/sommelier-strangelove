import {
  Stack,
  Center,
  Text,
  FormControl,
  IconButton,
  Image,
  Flex,
  HStack
} from "@chakra-ui/react"
import { Link } from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputEthereumAddress } from "components/_cards/BridgeCard/InputEthereumAddress"
import { InputSommelierAddress } from "components/_cards/BridgeCard/InputSommelierAddress"
import { SommelierAddress } from "components/_cards/BridgeCard/SommelierAddress"
import { SommReceivedInEth } from "components/_cards/BridgeCard/SommReceivedInEth"
import { ExternalLinkIcon, TimerIcon } from "components/_icons"
import {
  useAccount as useGrazAccount,
  useConnect as useGrazConnect,
} from "graz"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useBridgeEthToSommTx } from "hooks/web3/useBridgeEthToSommTx"
import { useBridgeSommToEthTx } from "hooks/web3/useBridgeSommToEthTx"
import { useEffect, VFC } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"
import { ChainSelector } from "components/ChainSelector";
import {chainConfigMap, chainSlugMap} from "data/chainConfig";

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

  return (
    <Stack spacing="40px" alignItems={"center"}>
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
                  chains={Object.keys(chainConfigMap)}
                  defaultValue={chainSlugMap.ETHEREUM.id}
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
                    chains={Object.keys(chainConfigMap)}
                    defaultValue={chainSlugMap.ARBITRUM.id}
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
      {isMounted && !buttonEnabled && toSomm && (
        <ConnectButton
          overrideChainId={"ethereum"}
          unstyled
          height="69px"
          fontSize="21px"
        >
          Connect Ethereum Wallet
        </ConnectButton>
      )}
      {isMounted && !buttonEnabled && toEth && (
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
