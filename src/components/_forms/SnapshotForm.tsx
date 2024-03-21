import { useForm, FormProvider } from "react-hook-form"
import { useAccount as useEthereumAccount, useNetwork } from "wagmi"
import { BaseButton } from "../_buttons/BaseButton"
import { HStack, Heading, Stack, VStack } from "@chakra-ui/react"
import { signWithKeplr } from "../../utils/keplr"
import { InputEthereumAddress } from "../_cards/SnapshotCard/InputEthereumAddress"
import { InputSommelierAddress } from "../_cards/SnapshotCard/InputSommelierAddress"
import { useBrandedToast } from "hooks/chakra"
import { chainSlugMap } from "data/chainConfig"

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
        body: "Please check your wallet connection and network.",
        closeHandler: close,
        duration: null,
      })
      return
    }

    try {
      const {
        signature,
        pubKey,
        messageContent,
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
          // Update this line to include the encoded data string
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
        body: "Your message has been successfully saved.",
        closeHandler: close,
        duration: null,
      })
    } catch (error) {
      console.error("Error in form submission: ", error)
      addToast({
        heading: "Error",
        status: "error",
        body: "There was an error submitting your form. Please try again.",
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
