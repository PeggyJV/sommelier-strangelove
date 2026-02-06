import { ModalProps } from "@chakra-ui/react"
import { FC } from "react"
import React from "react"
import { SommelierTab } from "./SommelierTab"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const WithdrawModal: FC<WithdrawModalProps> = (props) => {
  return (
    <ModalWithExchangeTab
      heading="Withdraw"
      sommelierTab={<SommelierTab {...props} />}
      {...props}
    />
  )
}
