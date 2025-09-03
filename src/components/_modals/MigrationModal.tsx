import { ModalProps, Text, VStack } from "@chakra-ui/react"
import { MigrationForm } from "components/_forms/MigrationForm"
import { CardHeading } from "components/_typography/CardHeading"
import { BaseModal } from "./BaseModal"

type MigrationModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const MigrationModal = (props: MigrationModalProps) => {
  return (
    <BaseModal heading="Migrate" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="flex-start">
          <CardHeading>Migrate to Alpha STETH</CardHeading>
          <Text as="span">
            Migrate your funds from this vault to Alpha STETH.
          </Text>
        </VStack>
      </VStack>
      <MigrationForm onClose={props.onClose} />
    </BaseModal>
  )
}
