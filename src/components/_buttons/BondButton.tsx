import { ButtonProps, useDisclosure, Tooltip } from "@chakra-ui/react"
import { BondModal } from "components/_modals/BondModal"
import { BaseButton } from "./BaseButton"

export const BondButton = (props: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Tooltip
        hasArrow
        arrowShadowColor="purple.base"
        label="Bond your LP tokens to earn liquidity mining rewards"
        placement="top"
        bg="surface.bg"
        color="neutral.300"
      >
        <BaseButton onClick={onOpen} {...props}>
          Boost Yield
        </BaseButton>
      </Tooltip>
      <BondModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
