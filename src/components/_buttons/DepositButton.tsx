import {
  ButtonProps,
  useDisclosure,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { DepositModal } from "components/_modals/DepositModal"
import { NotifyModal } from "components/_modals/NotifyModal"
import { FC, useEffect, useRef, useState } from "react"
import { BaseButton } from "./BaseButton"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { requestSwitchWithAdd } from "utils/wallet/chainUtils"
import { useBrandedToast } from "hooks/chakra"
import { analytics } from "utils/analytics"

export const DepositButton: FC<ButtonProps> = (props) => {
  const depositModal = useDisclosure()
  const notifyModal = useDisclosure()

  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const closeOracleModal = () => setOracleModalOpen(false)

  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const router = useRouter()
  const { isConnected, chain } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast, close } = useBrandedToast()
  const [isAutoOpening, setIsAutoOpening] = useState(false)
  const triggeredRef = useRef(false)

  // Deep link: auto-open deposit modal when ?action=deposit
  useEffect(() => {
    const action = router.query?.action
    if (action !== "deposit" || triggeredRef.current) return

    const run = async () => {
      try {
        setIsAutoOpening(true)
        analytics.track("deposit_guide.autopen.attempt", {
          wallet_connected: isConnected,
          network: chain?.id,
        })
        // Ensure wallet connected first
        if (!isConnected) {
          openConnectModal?.()
          return // wait for connection, effect will re-run
        }
        // Ensure correct network
        const expectedChainId = (cellarData as any)?.config?.chain
          ?.wagmiId as 1 | 42161 | 8453 | undefined
        if (expectedChainId && chain?.id !== expectedChainId) {
          try {
            await requestSwitchWithAdd(expectedChainId as any)
          } catch (e: any) {
            addToast({
              heading: "Unable to switch network",
              status: "error",
              body: (
                <Text>
                  Please switch to the correct network, then try
                  again. {e?.message}
                </Text>
              ),
              duration: 6000,
              closeHandler: close,
            })
            return
          }
        }
        // Open modal
        depositModal.onOpen()
        triggeredRef.current = true
        // Clean URL param
        const { action: _omit, ...rest } = router.query
        router.replace(
          { pathname: router.pathname, query: rest },
          undefined,
          { shallow: true }
        )
        analytics.track("deposit.modal-opened", {
          source: "deep_link",
        })
      } finally {
        setIsAutoOpening(false)
      }
    }

    run()
  }, [router.query?.action, isConnected, chain?.id])

  return (
    <ClientOnly>
      <BaseButton
        variant="solid"
        onClick={(e) => {
          e.stopPropagation()
          //! if share price oracle updating..
          //if (cellarData.slug === "Turbo-SOMM") {
          //  openOracleModal()
          //  return
          //}

          depositModal.onOpen()

          if (!depositModal.isOpen) {
            // analytics.track("deposit.modal-opened")
          }
        }}
        {...props}
      >
        {isAutoOpening ? (
          <HStack spacing={2} justify="center">
            <Spinner size="sm" />
            <Text as="span">Opening deposit…</Text>
          </HStack>
        ) : (
          "Deposit"
        )}
      </BaseButton>
      {isOracleModalOpen ? (
        <Modal
          isOpen={isOracleModalOpen}
          onClose={closeOracleModal}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            p={2}
            w="auto"
            zIndex={401}
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
            bg="surface.bg"
            fontWeight="semibold"
            _focus={{
              outline: "unset",
              outlineOffset: "unset",
              boxShadow: "unset",
            }}
          >
            <ModalCloseButton />
            <ModalHeader textAlign="center">Notice!</ModalHeader>
            <ModalBody textAlign="center">
              <Text>
                Deposits and withdrawals have been temporarily
                disabled for Turbo SOMM while our oracle updates.
                Normal operations are set to resume on Dec 21st.
              </Text>
              <br />
              <Text>
                All user funds are safe. We appreciate your
                understanding.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <>
          <DepositModal
            isOpen={depositModal.isOpen}
            onClose={depositModal.onClose}
            notifyModal={notifyModal}
          />
          <NotifyModal
            isOpen={notifyModal.isOpen}
            onClose={notifyModal.onClose}
          />
        </>
      )}
    </ClientOnly>
  )
}
