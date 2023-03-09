import { Input, ModalProps, Text } from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { BaseModal } from "./BaseModal"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { useBrandedToast } from "hooks/chakra"
import { useEffect } from "react"

export const NotifyModal = (
  rest: Pick<ModalProps, "isOpen" | "onClose">
) => {
  const { addToast, closeAll } = useBrandedToast()
  const formGuId = "9810be6f-df66-4685-be9a-0486852db1aa"
  const portalId = "23217408"
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const { register, handleSubmit, watch, reset } = useForm<{
    email: string
  }>()

  useEffect(() => {
    reset()
  }, [reset, rest.isOpen])

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const sendEmail: SubmitHandler<{ email: string }> = async ({
    email,
  }) => {
    try {
      const response = await axios
        .post(
          `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuId}`,
          {
            portalId,
            formGuId,
            fields: [
              {
                name: "email",
                value: email,
              },
            ],
          },
          config
        )
        .then(() => {
          addToast({
            heading: "Signed up successfully",
            status: "primary",
            body: "",
            duration: 4000,
            closeHandler: closeAll,
          })
          rest.onClose()
          reset()
        })

      return response
    } catch (error) {
      addToast({
        heading: "Signed up failed",
        status: "error",
        body: "",
        duration: 4000,
        closeHandler: closeAll,
      })
    }
  }

  const isDisabled = validateEmail(watch("email")) === null

  return (
    <BaseModal
      heading="Get Notified"
      headingProps={{
        fontSize: "2xl",
      }}
      {...rest}
    >
      <form onSubmit={handleSubmit(sendEmail)}>
        <Text
          textTransform="capitalize"
          color="neutral.300"
          fontSize="sm"
        >
          Sign up for new strategy launch and other product
          announcements—we’ll only use your email for this purpose.
        </Text>
        <Input
          {...register("email")}
          defaultValue=""
          id="email"
          mt={6}
          placeholder="Enter Email Address"
          fontSize="md"
          fontWeight="semibold"
          backgroundColor="surface.tertiary"
          variant="unstyled"
          borderRadius="16px"
          px={4}
          py={6}
          maxH="64px"
          _placeholder={{
            fontSize: "lg",
          }}
          type="text"
        />
        <BaseButton
          h="60px"
          mt={6}
          type="submit"
          w="full"
          isDisabled={isDisabled}
        >
          Submit
        </BaseButton>
      </form>
    </BaseModal>
  )
}
