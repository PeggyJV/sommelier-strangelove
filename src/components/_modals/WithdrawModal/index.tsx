import { ModalProps } from "@chakra-ui/react"
import { VFC } from "react"
import { Token as TokenType } from "data/tokenConfig"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import React from "react"
import { SommelierTab } from "./SommelierTab"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const WithdrawModal: VFC<WithdrawModalProps> = (props) => {
  return (
    <ModalWithExchangeTab
      heading="Sell"
      sommelierTab={<SommelierTab {...props} />}
      {...props}
    />
  )
}
