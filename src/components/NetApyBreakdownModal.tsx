import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Stack,
  HStack,
  Text,
  useDisclosure,
  Link as CLink,
} from "@chakra-ui/react"
import { alphaStethI18n } from "i18n/alphaSteth"

export function useNetApyBreakdownModal() {
  const controls = useDisclosure()
  return controls
}

export function NetApyBreakdownModal({
  isOpen,
  onClose,
  values = {
    lidoBase: "~3.6%",
    strategyBoost: "~7.2%",
    netAfterFees: "~10.4%",
  },
}: {
  isOpen: boolean
  onClose: () => void
  values?: { lidoBase?: string; strategyBoost?: string; netAfterFees?: string }
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="surface.bg" borderColor="surface.secondary" borderWidth={1}>
        <ModalHeader>{alphaStethI18n.breakdownTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <HStack justify="space-between">
              <Text>{alphaStethI18n.breakdownItems.lidoBase}</Text>
              <Text fontWeight={600}>{values.lidoBase}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>{alphaStethI18n.breakdownItems.strategyBoost}</Text>
              <Text fontWeight={600}>{values.strategyBoost}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>{alphaStethI18n.breakdownItems.netAfterFees}</Text>
              <Text fontWeight={700}>{values.netAfterFees}</Text>
            </HStack>
            <Text fontSize="xs" color="neutral.400">
              {alphaStethI18n.breakdownPlaceholder}
            </Text>
            <CLink
              href={alphaStethI18n.tooltipLinkHref}
              isExternal
              textDecor="underline"
              fontSize="sm"
            >
              {alphaStethI18n.tooltipLinkText}
            </CLink>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}


