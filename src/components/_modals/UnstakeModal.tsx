import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { toEther } from "utils/formatCurrency"
import { UnstakeForm } from "components/_forms/UnstakeForm"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalance } from "data/hooks/useUserBalance"

type UnstakeModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onCloseProp: () => void
}

export const UnstakeModal: VFC<UnstakeModalProps> = ({
  isOpen,
  onClose,
  onCloseProp,
}) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData } = lpToken

  return (
    <BaseModal heading="Unstake" isOpen={isOpen} onClose={onClose}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {toEther(lpTokenData?.formatted, 18)} LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <UnstakeForm onClose={onCloseProp} />
    </BaseModal>
  )
}
