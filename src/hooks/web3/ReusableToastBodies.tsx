import { HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import truncateWalletAddress from "utils/truncateWalletAddress"
import { AiFillCopy } from "react-icons/ai"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import type { ReactNode } from "react"

type ToastInput = {
  heading: string
  body: ReactNode
  status: "success" | "error" | "info" | "default"
  duration?: number | null
  closeHandler?: () => void
}

type AddToast = (toast: ToastInput) => void
type CloseAll = () => void

export const TxHashToastBody = ({
  title,
  hash,
  addToast,
  closeAll,
}: {
  title: string
  hash: string
  addToast: AddToast
  closeAll: CloseAll
}) => (
  <Stack>
    <Stack spacing={0} fontSize="xs">
      <Text>{title}</Text>
      <HStack>
        <Text fontWeight="bold">
          Tx Hash: {truncateWalletAddress(hash)}
        </Text>
        <CopyTxHashButton
          hash={hash}
          addToast={addToast}
          closeAll={closeAll}
        />
      </HStack>
    </Stack>
    <Link
      fontSize="sm"
      href={`https://www.mintscan.io/sommelier/txs/${hash}`}
      target="_blank"
      textDecor="underline"
    >
      <HStack>
        <Text>View on Mintscan</Text>
        <ExternalLinkIcon boxSize={3} />
      </HStack>
    </Link>
  </Stack>
)

export const BridgeTxHashToastBody = ({
  hash,
  amount,
  addToast: _addToast,
  closeAll: _closeAll,
}: {
  hash: string
  amount: string
  addToast: AddToast
  closeAll: CloseAll
}) => (
  <Stack>
    <Stack spacing={0} fontSize="xs">
      <HStack>
        <Text as="span" fontWeight="bold">
          Amount:
        </Text>
        <Text as="span">{amount} SOMM</Text>
      </HStack>
      <HStack>
        <Text as="span" fontWeight="bold">
          Destination:
        </Text>
        <Text as="span">Somm to Ethereum Mainnet</Text>
      </HStack>
      <HStack>
        <Text as="span" fontWeight="bold" width="15ch">
          Est. time:
        </Text>
        <Text as="span">
          1-5 min. Transaction may take additional time to process
          after network validation
        </Text>
      </HStack>
    </Stack>
    <Link
      fontSize="sm"
      href={`https://www.mintscan.io/sommelier/txs/${hash}`}
      target="_blank"
      textDecor="underline"
    >
      <HStack>
        <Text>View on Mintscan</Text>
        <ExternalLinkIcon boxSize={3} />
      </HStack>
    </Link>
  </Stack>
)

const CopyTxHashButton = ({
  hash,
  addToast,
  closeAll,
}: {
  hash: string
  addToast: AddToast
  closeAll: CloseAll
}) => (
  <IconButton
    onClick={() => {
      navigator.clipboard.writeText(hash)
      addToast({
        heading: "Copied to clipboard",
        body: null,
        status: "success",
        duration: null,
        closeHandler: closeAll,
      })
    }}
    aria-label="Copy to clipboard"
    icon={<AiFillCopy />}
  />
)
