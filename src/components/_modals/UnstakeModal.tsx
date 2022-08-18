import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { toEther } from "utils/formatCurrency"
import { UnstakeForm } from "components/_forms/UnstakeForm"

type UnstakeModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onCloseProp: () => void
}

export const UnstakeModal: VFC<UnstakeModalProps> = ({
  isOpen,
  onClose,
  onCloseProp,
}) => {
  const { userData } = useAaveV2Cellar()

  return (
    <BaseModal heading="Unstake" isOpen={isOpen} onClose={onClose}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {toEther(userData?.balances?.aaveClr, 18)} LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <UnstakeForm onClose={onCloseProp} />
    </BaseModal>
  )
}
