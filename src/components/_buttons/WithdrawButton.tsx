import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { WithdrawModal } from "components/_modals/WithdrawModal"

export const WithdrawButton: VFC<
  ButtonProps & {
    isDeprecated?: boolean
  }
> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    // analytics.track("withdraw.cancelled")
    onClose()
  }

  return (
    <>
      <SecondaryButton onClick={onOpen} {...props}>
        {props.isDeprecated ? "Withdraw Only" : "Withdraw"}
      </SecondaryButton>
      <WithdrawModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}
