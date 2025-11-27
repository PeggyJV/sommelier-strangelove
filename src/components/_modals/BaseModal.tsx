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
import { FC } from "react"

export interface BaseModalProps extends ModalProps {
  heading?: string
  headingProps?: HeadingProps
}

export const BaseModal: FC<BaseModalProps> = ({
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
        bg="brand.background"
        color="text.primary"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="lg"
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
