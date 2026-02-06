import React from "react"
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
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { BaseButton } from "../BaseButton"
import { ChevronDownIcon, LogoutCircleIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useBrandedToast } from "hooks/chakra"
import { chainConfig } from "data/chainConfig"
import { tokenConfig, tokenConfigMap } from "data/tokenConfig"
import { useImportToken } from "hooks/web3/useImportToken"
import { getAddress } from "viem"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

export const ConnectedPopover = () => {
  const { addToast, close } = useBrandedToast()
  const { disconnect } = useDisconnect()
  const { address, isConnecting, chain } = useAccount()
  const { data: ensName } = useEnsName({
    address,
  })
  const { data: ensAvatar } = useEnsAvatar({ name: address })

  const chainObj = chainConfig.find((c) => c.wagmiId === chain?.id)
  const sommToken = tokenConfig.find(
    (t) => t.coinGeckoId === "sommelier" && t.chain === chainObj?.id
  )

  const avatarSrc = sommToken
    ? sommToken.src
    : "/assets/icons/somm.svg"

  const importToken = useImportToken({
    onSuccess: (data) => {
      const tokenData = data as unknown as { symbol: string }
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{tokenData.symbol} added to metamask</Text>,
        closeHandler: close,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: close,
      })
    },
  })

  const handleImportToken = () => {
    const fullImageUrl = `${window.origin}${tokenConfigMap.SOMM_ETHEREUM.src}`
    importToken.mutate({
      address: getAddress(sommToken?.address ?? ""),
      imageUrl: fullImageUrl,
      chain: sommToken?.chain ?? "",
    })
    addToast({
      heading: "Importing Token",
      body: <Text>Importing SOMM token to wallet...</Text>,
      status: "info",
    })
  }

  function onDisconnect() {
    analytics.track("wallet.disconnected", {
      account: address,
    })
    disconnect()
  }

  const walletAddressIcon = () => {
    if (ensAvatar) {
      return <Avatar boxSize={"16px"} src={ensAvatar} />
    } else if (address) {
      return (
        <Jazzicon diameter={16} seed={jsNumberForAddress(address)} />
      )
    } else {
      return (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#EEE",
          }}
        ></div>
      )
    }
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

  const isLoading = isConnecting && !address

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ""
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = !useBetterMediaQuery("(min-width: 768px)")

  if (isMobile) {
    return (
      <>
        <BaseButton
          variant="sommOutline"
          borderRadius="full"
          w="full"
          minH={{ base: "44px", md: "48px" }}
          pl={{ base: 3, md: 6 }}
          pr={{ base: 3, md: 12 }}
          minW={{ base: 0, md: "176px" }}
          maxW="100%"
          zIndex={401}
          isLoading={isLoading}
          position="relative"
          _hover={{ bg: "purple.dark" }}
          onClick={onOpen}
        >
          <HStack
            spacing={2}
            align="center"
            justify="space-between"
            maxW="100%"
            w="full"
          >
            <HStack spacing={2} minW={0} flex={1}>
              {isLoading ? <Spinner size="xs" /> : undefined}
              {walletAddressIcon()}
              <Text whiteSpace="nowrap" isTruncated maxW="100%">
                {ensName ? ensName : shortAddress}
              </Text>
            </HStack>
            <Box>
              <ChevronDownIcon />
            </Box>
          </HStack>
        </BaseButton>

        <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg="surface.bg" borderTopRadius={16}>
            <DrawerHeader
              borderBottomWidth="1px"
              borderColor="surface.tertiary"
            >
              Wallet
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing={2}>
                <Button
                  variant="ghost"
                  height="48px"
                  justifyContent="flex-start"
                  onClick={() => {
                    window.open(
                      `${chain?.blockExplorers?.default.url}/address/${address}`,
                      "_blank"
                    )
                    onClose()
                  }}
                  _hover={{ bg: "purple.dark" }}
                >
                  {`View on ${chain?.blockExplorers?.default.name}`}
                </Button>
                <Button
                  variant="ghost"
                  height="48px"
                  justifyContent="flex-start"
                  onClick={() => {
                    handleCopyAddressToClipboard()
                    onClose()
                  }}
                  _hover={{ bg: "purple.dark" }}
                >
                  Copy to clipboard
                </Button>
                <Button
                  variant="ghost"
                  height="48px"
                  justifyContent="flex-start"
                  onClick={() => {
                    onDisconnect()
                    onClose()
                  }}
                  _hover={{ bg: "purple.dark" }}
                >
                  Disconnect Wallet
                </Button>
                <Button
                  variant="ghost"
                  height="48px"
                  justifyContent="flex-start"
                  onClick={() => {
                    handleImportToken()
                    onClose()
                  }}
                  _hover={{ bg: "purple.dark" }}
                >
                  Import SOMM token to Wallet
                </Button>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <BaseButton
          variant="sommOutline"
          borderRadius="full"
          w="full"
          minH={{ base: "44px", md: "48px" }}
          pl={{ base: 3, md: 6 }}
          pr={{ base: 3, md: 12 }}
          minW={{ base: 0, md: "176px" }}
          maxW="100%"
          zIndex={401}
          isLoading={isLoading}
          position="relative"
          _hover={{ bg: "purple.dark" }}
        >
          <HStack
            spacing={2}
            align="center"
            justify="space-between"
            maxW="100%"
            w="full"
          >
            <HStack spacing={2} minW={0} flex={1}>
              {isLoading ? <Spinner size="xs" /> : undefined}
              {walletAddressIcon()}
              <Text whiteSpace="nowrap" isTruncated maxW="100%">
                {ensName ? ensName : shortAddress}
              </Text>
            </HStack>
            <Box>
              <ChevronDownIcon />
            </Box>
          </HStack>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent
        p={2}
        maxW="max-content"
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
              onClick={onDisconnect}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon />
              <Text fontWeight="semibold">Disconnect Wallet</Text>
            </HStack>
            <Stack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={handleImportToken}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <HStack>
                <Avatar src={avatarSrc} size="2xs" />
                <Text fontWeight="semibold">
                  Import SOMM token to Wallet
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
