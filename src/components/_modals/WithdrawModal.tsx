import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { WithdrawForm } from "components/_forms/WithdrawForm"
import { CardHeading } from "components/_typography/CardHeading"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { toEther } from "utils/formatCurrency"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const WithdrawModal: VFC<WithdrawModalProps> = (props) => {
  const { userData } = useAaveV2Cellar()

  return (
    <BaseModal heading="Withdraw" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {toEther(userData?.balances?.aaveClr, 18)} LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <WithdrawForm />
    </BaseModal>
  )
}
