import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { analytics } from "utils/analytics"
import { WithdrawModal } from "components/_modals/WithdrawModal"

export const WithdrawButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    analytics.track("withdraw.cancelled")
    onClose()
  }

  return (
    <>
      <SecondaryButton onClick={onOpen} {...props}>
        Sell
      </SecondaryButton>
      <WithdrawModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}
