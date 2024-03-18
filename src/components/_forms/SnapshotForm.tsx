import {
  Stack,
  Center,
  Text,
  FormControl,
  IconButton,
  Image,
  Flex,
  HStack,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import { BaseButton } from "components/_buttons/BaseButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { SnapshotFormValues } from "components/_cards/SnapshotCard"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputEthereumAddress } from "components/_cards/SnapshotCard/InputEthereumAddress"
import { InputSommelierAddress } from "components/_cards/SnapshotCard/InputSommelierAddress"
import { SommelierAddress } from "components/_cards/SnapshotCard/SommelierAddress"
import { ExternalLinkIcon, TimerIcon } from "components/_icons"
import {
  useAccount as useGrazAccount,
  useConnect as useGrazConnect,
} from "graz"
import { useBrandedToast } from "hooks/chakra"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useEffect, VFC } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"

interface SnapshotFormProps {
  eth_address: string
  somm_address: string
}

export const BridgeForm: VFC<SnapshotFormProps> = ({}) => {
  const { addToast, closeAll } = useBrandedToast()
  const isMounted = useIsMounted()
  const { watch, handleSubmit, formState, getFieldState, setValue } =
    useFormContext<SnapshotFormValues>()

  const watchSommelierAddress = watch("somm_address")
  const watchEthereumAddress = watch("eth_address")

  useEffect(() => {
    setValue("eth_address", "")
    setValue("eth_address", "")
  }, [watchSommelierAddress, watchEthereumAddress, setValue])

  const { connectAsync } = useGrazConnect()
  const { isConnected: isGrazConnected } = useGrazAccount()

  const { isConnected } = useAccount()

  const buttonEnabled = isConnected || isGrazConnected

  const Eth = () => (
    <HStack
      borderRadius="16px"
      borderWidth="1px"
      borderColor="neutral.600"
      p={2}
      px={4}
    >
      <Image
        src="/assets/icons/eth.png"
        alt="eth"
        w="16px"
        h="16px"
      />
      <Text fontWeight="bold">Ethereum</Text>
    </HStack>
  )
  const Somm = () => (
    <HStack
      borderRadius="16px"
      borderWidth="1px"
      borderColor="neutral.600"
      p={2}
      px={4}
    >
      <Image
        src="/assets/images/coin.png"
        alt="eth"
        w="16px"
        h="16px"
      />
      <Text fontWeight="bold">Sommelier</Text>
    </HStack>
  )
  return (
    <Stack spacing="40px" alignItems={"center"}>
      <Stack
        spacing="40px"
        as="form"
        onSubmit={handleSubmit(doSommToEth)}
      >
        <Stack spacing={6}>
          <HStack justifyContent="space-between">
            <Stack flex={1}>
              <Text
                fontWeight="bold"
                color="neutral.400"
                fontSize="xs"
              >
                From
              </Text>
              {watchType === "TO_SOMMELIER" ? <Eth /> : <Somm />}
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
                onClick={() =>
                  setValue(
                    "type",
                    watchType === "TO_SOMMELIER"
                      ? "TO_ETHEREUM"
                      : "TO_SOMMELIER"
                  )
                }
              />
            </Flex>
            <Stack flex={1}>
              <Text
                fontWeight="bold"
                color="neutral.400"
                fontSize="xs"
              >
                To
              </Text>
              {watchType === "TO_SOMMELIER" ? <Somm /> : <Eth />}
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
