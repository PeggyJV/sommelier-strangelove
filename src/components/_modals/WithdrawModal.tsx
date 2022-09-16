import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { WithdrawForm } from "components/_forms/WithdrawForm"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { toEther } from "utils/formatCurrency"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useUserBalances } from "src/composite-data/hooks/output/useUserBalances"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onCloseProp: () => void
}

export const WithdrawModal: VFC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onCloseProp,
}) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData, isLoading } = lpToken

  return (
    <BaseModal heading="Withdraw" isOpen={isOpen} onClose={onClose}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {isLoading
              ? "..."
              : toEther(lpTokenData?.formatted, 18, false)}{" "}
            LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <WithdrawForm onClose={onCloseProp} />
    </BaseModal>
  )
}
