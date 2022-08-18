import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { analytics } from "utils/analytics"
import { UnstakeModal } from "components/_modals/UnstakeModal"

export const UnstakeButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    analytics.track("unstake.cancelled")
    onClose()
  }

  return (
    <>
      <SecondaryButton size={"sm"} onClick={onOpen} {...props}>
        Unstake
      </SecondaryButton>
      <UnstakeModal
        isOpen={isOpen}
        onClose={closeModal}
        onCloseProp={onClose}
      />
    </>
  )
}
