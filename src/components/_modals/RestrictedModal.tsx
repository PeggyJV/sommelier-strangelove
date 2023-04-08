import { Link, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { BaseModal } from "./BaseModal"

export const RestrictedModal = (
  props: ReturnType<typeof useDisclosure>
) => {
  return (
    <BaseModal heading="Access Restricted" {...props}>
      <Stack spacing={6}>
        <Text>
          You may be attempting to use Sommelier in a restricted
          territory or while using a VPN which shows your location as
          a restricted territory (including the United States).
        </Text>
        <Text>
          Make sure your VPN settings are updated to your real
          location, and you are not using Safari Private browsing,
          then try again. To learn more, view our{" "}
          <Link
            href="https://app.sommelier.finance/user-terms"
            isExternal
            textDecor="underline"
          >
            terms of service.
          </Link>
        </Text>
        <BaseButton
          size="lg"
          height="70px"
          fontSize="21px"
          onClick={props.onClose}
        >
          Got it
        </BaseButton>
      </Stack>
    </BaseModal>
  )
}
