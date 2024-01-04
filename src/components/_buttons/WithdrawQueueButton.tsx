import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { Chain } from "src/data/chainConfig"
import { WithdrawQueueModal } from "components/_modals/WithdrawQueueModal"

export const WithdrawQueueButton: VFC<
  ButtonProps & {
    chain: Chain
    buttonLabel: string
    onSuccessfulWithdraw?: () => void
  }
> = ({ buttonLabel, onSuccessfulWithdraw, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    onClose()
  }

  return (
    <>
      <SecondaryButton
        onClick={(e) => {
          onOpen()
        }}
        {...props}
      >
        {buttonLabel}
      </SecondaryButton>
      <WithdrawQueueModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccessfulWithdraw={onSuccessfulWithdraw}
      />
    </>
  )
}
