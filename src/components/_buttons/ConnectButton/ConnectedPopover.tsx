import {
  Avatar,
  Box,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import truncateWalletAddress from "src/utils/truncateWalletAddress"
import { useAccount } from "wagmi"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { BaseButton } from "../BaseButton"
import {
  LogoutCircleIcon,
  SettingsSliderIcon,
} from "components/_icons"
import { analytics } from "utils/analytics"

export const ConnectedPopover = () => {
  const toast = useToast()
  const [account, disconnect] = useAccount({
    fetchEns: true,
  })

  function onDisconnect() {
    analytics.track("wallet.disconnected", {
      account: account?.data?.address,
    })

    disconnect()
  }

  const walletAddress = account?.data?.address
  const walletENS = account?.data?.ens

  const walletAddressIcon = () => {
    if (walletENS?.avatar) {
      return <Avatar boxSize={"16px"} src={walletENS.avatar} />
    }
    if (walletAddress) {
      return (
        <Jazzicon
          diameter={16}
          seed={jsNumberForAddress(walletAddress)}
        />
      )
    }
  }

  const handleCopyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)

      toast({
        title: "Copied to clipboard",
        status: "success",
        isClosable: true,
      })
    }
  }

  // to make sure the loading is about not about fetching ENS
  const isLoading = account.loading && !account.data?.address

  return (
    <Popover placement="bottom-end">
      <HStack spacing={2}>
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="Copy to clipboard"
          placement="bottom"
          color="neutral.300"
          bg="surface.bg"
        >
          <BaseButton
            bg="surface.primary"
            borderWidth={1}
            borderColor="surface.secondary"
            borderRadius={12}
            icon={walletAddressIcon}
            minW="max-content"
            isLoading={isLoading}
            // loading state fetching ENS
            leftIcon={
              (account.loading && <Spinner size="xs" />) || undefined
            }
            onClick={handleCopyAddressToClipboard}
            fontFamily="SF Mono"
            fontSize={12}
            _hover={{
              bg: "purple.dark",
              borderColor: "surface.tertiary",
            }}
          >
            {walletENS?.name
              ? walletENS.name
              : truncateWalletAddress(walletAddress)}
          </BaseButton>
        </Tooltip>
        <PopoverTrigger>
          <BaseButton
            p={3}
            bg="surface.primary"
            borderWidth={1}
            borderColor="surface.secondary"
            borderRadius={12}
            minW="max-content"
            isLoading={isLoading}
            _hover={{
              bg: "purple.dark",
              borderColor: "surface.tertiary",
            }}
          >
            <SettingsSliderIcon />
          </BaseButton>
        </PopoverTrigger>
      </HStack>
      <PopoverContent
        p={2}
        maxW="max-content"
        borderWidth={1}
        borderColor="purple.dark"
        borderRadius={12}
        bg="surface.primary"
        fontWeight="semibold"
        _focus={{
          outline: "unset",
          outlineOffset: "unset",
          boxShadow: "unset",
        }}
      >
        <PopoverBody p={0}>
          <VStack align="flex-start">
            <Link
              href={`https://etherscan.io/address/${walletAddress}`}
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
              View on Etherscan
            </Link>
            <Box
              h="auto"
              py={2}
              px={4}
              fontSize="sm"
              onClick={onDisconnect}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon mr={2} /> Disconnect Wallet
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
