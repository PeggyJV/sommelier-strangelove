import { ButtonProps, useDisclosure, Tooltip } from "@chakra-ui/react"
import { BondModal } from "components/_modals/BondModal"
import { VFC } from "react"
import { BaseButton } from "./BaseButton"

export const BondButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Tooltip
        hasArrow
        arrowShadowColor="purple.base"
        label="Bond your LP tokens after depositing to earn liquidity mining rewards"
        placement="top"
        bg="surface.bg"
        color="neutral.300"
      >
        <BaseButton onClick={onOpen} {...props}>
          Start Earning
        </BaseButton>
      </Tooltip>
      <BondModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
