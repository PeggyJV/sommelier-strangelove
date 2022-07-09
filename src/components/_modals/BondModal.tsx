import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { BondForm } from "components/_forms/BondForm"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { toEther } from "utils/formatCurrency"

type BondModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const BondModal: VFC<BondModalProps> = (props) => {
  const { userData } = useAaveV2Cellar()

  return (
    <BaseModal heading="Bond" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {toEther(userData?.balances?.aaveClr)} LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <BondForm onClose={props.onClose} />
    </BaseModal>
  )
}
