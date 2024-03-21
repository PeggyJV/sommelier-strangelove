import { useForm, FormProvider } from "react-hook-form"
import { useAccount as useEthereumAccount } from "wagmi"
import { BaseButton } from "../_buttons/BaseButton"
import { Stack, Text } from "@chakra-ui/react"
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

    // Check if the addresses are already registered
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

      // Notify user about existing registration but allow to continue
      if (checkResponse.status === 409) {
        addToast({
          heading: "Already Registered",
          status: "warning",
          body: (
            <Text>
              {checkData.message}. You can still proceed to sign and
              update your registration.
            </Text>
          ),
          closeHandler: close,
          duration: null,
        })
        // Do not return; allow the process to continue
      } else if (!checkResponse.ok) {
        // Handle other server errors
        throw new Error(
          checkData.message || "Failed to check registration"
        )
      }

      // Continue with the signing process
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
        <Stack spacing={4}>
          <InputEthereumAddress disabled={true} />
          <InputSommelierAddress disabled={true} />
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
        </Stack>
      </form>
    </FormProvider>
  )
}

export default SnapshotForm
