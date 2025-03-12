import React, { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useAccount as useEthereumAccount } from "wagmi"
import { BaseButton } from "../_buttons/BaseButton"
import { Stack, Text, Box } from "@chakra-ui/react"
import { signWithKeplr } from "../../utils/keplr"
import { InputEthereumAddress } from "../_cards/SnapshotCard/InputEthereumAddress"
import { InputSommelierAddress } from "../_cards/SnapshotCard/InputSommelierAddress"
import { useBrandedToast } from "hooks/chakra"

interface SnapshotFormProps {
  wrongNetwork: boolean
}

interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

const SnapshotForm: React.FC<SnapshotFormProps> = ({
  wrongNetwork,
}) => {
  const methods = useForm<SnapshotFormValues>()
  const { isConnected: isEthereumConnected } = useEthereumAccount()
  const ethAddress = methods.watch("eth_address")
  const sommAddress = methods.watch("somm_address")
  const isFormFilled = ethAddress && sommAddress
  const { addToast, close } = useBrandedToast()

  const [registrationMessage, setRegistrationMessage] = useState("")
  const [stakedSommTokens, setStakedSommTokens] = useState<
    number | null
  >(null)

  useEffect(() => {
    const checkRegistration = async () => {
      if (!isEthereumConnected || wrongNetwork) return

      try {
        const checkResponse = await fetch("/api/checkRegistration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ethAddress: ethAddress,
            sommAddress: sommAddress,
          }),
        })

        const checkData = await checkResponse.json()

        if (checkResponse.status === 409) {
          setRegistrationMessage(checkData.message)
        } else if (!checkResponse.ok) {
          throw new Error(
            checkData.message || "Failed to check registration"
          )
        }
      } catch (error) {
        console.error("Error checking registration: ", error)
      }
    }

    checkRegistration()
  }, [isEthereumConnected, wrongNetwork, ethAddress, sommAddress])

  // if (!isEthereumConnected || wrongNetwork) {
  //   return (
  //     <Stack gap={4} align="center">
  //       <ConnectButton
  //         overridechainid={"ethereum"}
  //         unstyled
  //         height="69px"
  //         fontSize="21px"
  //       >
  //         Connect Ethereum Wallet
  //       </ConnectButton>
  //     </Stack>
  //   )
  // }

  const onSubmit = async (data: SnapshotFormValues) => {
    if (!isEthereumConnected || wrongNetwork) {
      addToast({
        heading: "Submission Error",
        status: "error",
        body: (
          <Text>
            Please check your wallet connection and network.
          </Text>
        ),
        closeHandler: close,
        duration: null,
      })
      return
    }
    try {
      const checkResponse = await fetch("/api/checkRegistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ethAddress: data.eth_address,
          sommAddress: data.somm_address,
        }),
      })

      const checkData = await checkResponse.json()

      if (checkResponse.status === 409) {
        addToast({
          heading: "Already Registered",
          status: "warning",
          body: (
            <Box maxWidth="90vw" padding="2">
              <Text wordBreak="break-word">
                {checkData.message}. You can still proceed to sign and
                update your registration.
              </Text>
            </Box>
          ),
          closeHandler: close,
          duration: null,
        })
      } else if (!checkResponse.ok) {
        throw new Error(
          checkData.message || "Failed to check registration"
        )
      }

      const {
        signature,
        pubKey,
        data: encodedData,
      } = await signWithKeplr(
        data.somm_address,
        data.eth_address,
        data.somm_address
      )

      const response = await fetch("/api/saveSignedMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sommAddress: data.somm_address,
          ethAddress: data.eth_address,
          signature,
          pubKey,
          data: encodedData,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(
          `HTTP error! status: ${response.status}. Body: ${text}`
        )
      }

      const responseData = await response.json()
      console.log("Response from server:", responseData)
      addToast({
        heading: "Success",
        status: "success",
        body: (
          <Text>Your addresses have been successfully signed.</Text>
        ),
        closeHandler: close,
        duration: null,
      })
    } catch (error) {
      console.error("Error in form submission: ", error)
      addToast({
        heading: "Submission Error",
        status: "error",
        body: (
          <Text>
            There was an error during the submission process. Please
            try again.
          </Text>
        ),
        closeHandler: close,
        duration: null,
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack gap={4}>
          {registrationMessage && (
            <Text color="white">{registrationMessage}</Text>
          )}
          <InputEthereumAddress disabled={true} />
          <InputSommelierAddress disabled={true} />
          <Text color="white">
            {stakedSommTokens !== null &&
              `Staked SOMM tokens: ${stakedSommTokens}`}
          </Text>
          <BaseButton
            height="69px"
            fontSize="21px"
            type="submit"
            colorScheme="purple"
            isDisabled={
              !isEthereumConnected || wrongNetwork || !isFormFilled
            }
          >
            Sign
          </BaseButton>
          <Text color="white">
            Re-link to update with a new wallet at any time.
          </Text>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default SnapshotForm
