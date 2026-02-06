import { ModalProps } from "@chakra-ui/react"
import { AlphaStethMigrationForm } from "components/_forms/AlphaStethMigrationForm"
import { FC } from "react"

type MigrationModalProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  onSuccessfulMigration?: () => void
}

export const AlphaStethMigrationTab: FC<MigrationModalProps> = ({
  onClose,
  onSuccessfulMigration,
}) => {
  return (
    <AlphaStethMigrationForm
      onClose={onClose}
      onSuccessfulMigration={onSuccessfulMigration}
    />
  )
}
