import { HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import truncateWalletAddress from "utils/truncateWalletAddress"
import { AiFillCopy } from "react-icons/ai"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"

export const TxHashToastBody = ({
  title,
  hash,
  addToast,
  closeAll,
}: {
  title: string
  hash: string
  addToast: Function
  closeAll: Function
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
  addToast,
  closeAll,
}: {
  hash: string
  amount: string
  addToast: Function
  closeAll: Function
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
        <Text as="span">Sommelier to Ethereum Mainnet</Text>
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
  addToast: Function
  closeAll: Function
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
