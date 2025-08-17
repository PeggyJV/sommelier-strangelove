import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
import { BaseButton } from "./BaseButton"
import { WithdrawQueueModal } from "components/_modals/WithdrawQueueModal"
import { Chain } from "src/data/chainConfig"
export const WithdrawQueueButton = ({ buttonLabel, onSuccessfulWithdraw, showTooltip, ...props }: ButtonProps & {
  buttonLabel: string
  onSuccessfulWithdraw?: () => void
  showTooltip?: boolean
  chain: Chain
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    onClose()
  }

  return (
    <>
      <Tooltip
        hasArrow
        arrowShadowColor="purple.base"
        label={
          "Save gas by initiating a withdrawal request which will be automatically fulfilled at a later time"
        }
        color="neutral.300"
        placement="bottom"
        bg="surface.bg"
        hidden={!showTooltip}
        textAlign="center"
      >
        <BaseButton
          onClick={(e) => {
            onOpen()
          }}
          {...props}
        >
          {buttonLabel}
        </BaseButton>
      </Tooltip>
      <WithdrawQueueModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccessfulWithdraw={onSuccessfulWithdraw}
      />
    </>
  )
}
