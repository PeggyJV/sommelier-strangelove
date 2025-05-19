import { ModalProps } from "@chakra-ui/react"
import { WithdrawQueueForm } from "components/_forms/WithdrawQueueForm"
import { FC } from "react"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onSuccessfulWithdraw?: () => void
}

export const SommelierTab: FC<WithdrawModalProps> = ({
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
