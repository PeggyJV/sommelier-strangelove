import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { BondForm } from "components/_forms/BondForm"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { toEther } from "utils/formatCurrency"
import { useUserBalances } from "src/composite-data/hooks/output/useUserBalances"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"

type BondModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const BondModal: VFC<BondModalProps> = (props) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { lpToken } = useUserBalances(cellarConfig)
  const [{ data: lpTokenData }] = lpToken

  return (
    <BaseModal heading="Bond" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {toEther(lpTokenData?.formatted, 18, false)} LP TOKENS
          </Text>
        </VStack>
      </VStack>
      <BondForm onClose={props.onClose} />
    </BaseModal>
  )
}
