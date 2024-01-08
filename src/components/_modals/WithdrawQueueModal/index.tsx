import { ModalProps } from "@chakra-ui/react"
import { VFC } from "react"
import React from "react"
import { SommelierTab } from "./SommelierTab"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

type WithdrawQueueModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose"
> & {
  onSuccessfulWithdraw?: () => void
}

export const WithdrawQueueModal: VFC<WithdrawQueueModalProps> = ({
  onSuccessfulWithdraw,
  ...props
}) => {
  return (
    <ModalWithExchangeTab
      heading="Withdraw Queue"
      sommelierTab={
        <SommelierTab
          onSuccessfulWithdraw={onSuccessfulWithdraw}
          {...props}
        />
      }
      {...props}
    />
  )
}