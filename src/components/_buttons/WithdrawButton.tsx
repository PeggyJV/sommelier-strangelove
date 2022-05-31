import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { WithdrawModal } from "components/_modals/WithdrawModal"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"

export const WithdrawButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <SecondaryButton onClick={onOpen} {...props}>
        Withdraw
      </SecondaryButton>
      <WithdrawModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
