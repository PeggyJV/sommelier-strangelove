import { ModalProps } from "@chakra-ui/react"
import { WithdrawQueueForm } from "components/_forms/WithdrawQueueForm"
import { VFC } from "react"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onSuccessfulWithdraw?: () => void
}

export const SommelierTab: VFC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccessfulWithdraw,
}) => {
  return (
    <WithdrawQueueForm
      onClose={onClose}
      onSuccessfulWithdraw={onSuccessfulWithdraw}
    />
  )
}
