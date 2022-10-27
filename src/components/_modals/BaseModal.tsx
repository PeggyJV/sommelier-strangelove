import {
  Heading,
  HeadingProps,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import { VFC } from "react"

interface BaseModalProps extends ModalProps {
  heading?: string
  headingProps?: HeadingProps
}

export const BaseModal: VFC<BaseModalProps> = ({
  children,
  heading,
  headingProps,
  ...rest
}) => {
  return (
    <Modal {...rest}>
      <ModalOverlay />
      <ModalContent
        px={8}
        py={10}
        bg="surface.bg"
        color="neutral.100"
        border="1px solid"
        borderColor="purple.base"
        borderRadius={24}
      >
        <HStack pb={10} justify="space-between">
          {heading && (
            <Heading fontSize="4xl" {...headingProps}>
              {heading}
            </Heading>
          )}
          <ModalCloseButton position="static" size="lg" />
        </HStack>
        {children}
      </ModalContent>
    </Modal>
  )
}
