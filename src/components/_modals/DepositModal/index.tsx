import { ModalProps } from "@chakra-ui/react"
import { VFC } from "react"

import { SommelierTab } from "./SommelierTab"
import React from "react"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  return (
    <ModalWithExchangeTab
      heading="Buy"
      sommelierTab={<SommelierTab {...props} />}
      {...props}
    />
  )
}
