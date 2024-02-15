import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { Chain } from "src/data/chainConfig"
import { WithdrawQueueModal } from "components/_modals/WithdrawQueueModal"

export const WithdrawQueueButton: VFC<
  ButtonProps & {
    chain: Chain
    buttonLabel: string
    onSuccessfulWithdraw?: () => void
    showTooltip?: boolean
  }
> = ({ buttonLabel, onSuccessfulWithdraw, showTooltip, ...props }) => {
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
          "Request a specific asset and save gas by initiating a withdrawal request which will be automatically fulfilled at a later time"
        }
        color="neutral.300"
        placement="bottom"
        bg="surface.bg"
        hidden={!showTooltip}
        textAlign="center"
      >
        <SecondaryButton
          onClick={(e) => {
            onOpen()
          }}
          {...props}
        >
          {buttonLabel}
        </SecondaryButton>
      </Tooltip>
      <WithdrawQueueModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccessfulWithdraw={onSuccessfulWithdraw}
      />
    </>
  )
}
