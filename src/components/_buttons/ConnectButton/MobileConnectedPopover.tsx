///Users/henriots/Desktop/sommelier-strangelove-1/src/components/_buttons/ConnectButton/MobileConnectedPopover.tsx
import {
  Avatar,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Stack,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import truncateWalletAddress, {
  truncateString,
} from "src/utils/truncateWalletAddress"
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { BaseButton } from "../BaseButton"
import { ChevronDownIcon, LogoutCircleIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useBrandedToast } from "hooks/chakra"
import { useRouter } from "next/router"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

export const MobileConnectedPopover = () => {
  const isLarger480 = useBetterMediaQuery("(min-width: 480px)")

  const { addToast } = useBrandedToast()
  const { disconnect } = useDisconnect()
  const { address, isConnecting } = useAccount()
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
  })
  const { data: ensAvatar, isLoading: ensAvatarLoading } =
    useEnsAvatar({ address })
  const { chain } = useNetwork()

  const handleDisconnect = () => {
    analytics.track("wallet.disconnected", { account: address })
    disconnect()
    window.location.reload()
  }

  const handleCopyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      addToast({
        heading: "Copied to clipboard",
        body: <Text>Wallet address copied to clipboard</Text>,
        status: "success",
      })
    }
  }

  const walletAddressIcon = () => {
    return ensAvatar ? (
      <Avatar boxSize={"16px"} src={ensAvatar} />
    ) : (
      <Jazzicon
        diameter={16}
        seed={jsNumberForAddress(address ?? "")}
      />
    )
  }

  const isLoading = isConnecting && !address
  const isEnsLoading = ensAvatarLoading || ensNameLoading

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <BaseButton
          bg="surface.primary"
          borderWidth={2}
          borderColor="purple.base"
          borderRadius="full"
          rightIcon={
            <HStack>
              {walletAddressIcon()}
              <ChevronDownIcon />
            </HStack>
          }
          minW="max-content"
          isLoading={isLoading}
          leftIcon={
            isLoading || isEnsLoading ? (
              <Spinner size="xs" />
            ) : undefined
          }
          fontFamily="Haffer"
          fontSize={12}
          _hover={{ bg: "purple.dark" }}
        >
          {ensName
            ? isLarger480
              ? ensName
              : truncateString(ensName)
            : truncateWalletAddress(address, isLarger480 ? 3 : 2)}
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent
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
        <PopoverBody p={0}>
          <Stack>
            <Link
              href={`${chain?.blockExplorers?.default.url}/address/${address}`}
              isExternal
              py={2}
              px={4}
              fontSize="sm"
              _hover={{
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon mr={2} />
              {`View on ${chain?.blockExplorers?.default.name}`}
            </Link>
            <HStack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={handleCopyAddressToClipboard}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon />
              <Text fontWeight="semibold">Copy to clipboard</Text>
            </HStack>
            <HStack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={handleDisconnect}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon />
              <Text fontWeight="semibold">Disconnect Wallet</Text>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
