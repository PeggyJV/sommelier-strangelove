import {
  Avatar,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tooltip,
  useToast,
  Text,
  Stack,
  Flex,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import truncateWalletAddress from "src/utils/truncateWalletAddress"
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { BaseButton } from "../BaseButton"
import {
  LogoutCircleIcon,
  SettingsSliderIcon,
} from "components/_icons"
import { analytics } from "utils/analytics"
import { useImportToken } from "hooks/web3/useImportToken"
import { cellarDataMap } from "data/cellarDataMap"
import { useBrandedToast } from "hooks/chakra"
import { config } from "utils/config"

export const ConnectedPopover = () => {
  const toast = useToast()
  const { addToast, close } = useBrandedToast()
  const { disconnect } = useDisconnect()
  const { address, isConnecting } = useAccount()
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
  })
  const { data: ensAvatar, isLoading: ensAvatarLoading } =
    useEnsAvatar({
      addressOrName: address,
    })
  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to metamask</Text>,
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

  function onDisconnect() {
    analytics.track("wallet.disconnected", {
      account: address,
    })

    disconnect()
  }

  const walletAddressIcon = () => {
    if (ensAvatar) {
      return <Avatar boxSize={"16px"} src={ensAvatar} />
    }
    if (address) {
      return (
        <Jazzicon diameter={16} seed={jsNumberForAddress(address)} />
      )
    }
  }

  const handleCopyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)

      toast({
        title: "Copied to clipboard",
        status: "success",
        isClosable: true,
      })
    }
  }

  const importAllToken = async () => {
    const arr = Object.values(cellarDataMap)
    for (let i = 0; i < arr.length; i++) {
      await importToken.mutateAsync({
        address: arr[i].config.lpToken.address,
      })
    }
    const fullImageUrl = `${window.origin}${config.CONTRACT.SOMMELLIER.IMAGE_PATH}`
    await importToken.mutateAsync({
      address: config.CONTRACT.SOMMELLIER.ADDRESS,
      imageUrl: fullImageUrl,
    })
  }

  // to make sure the loading is about not about fetching ENS
  const isLoading = isConnecting && !address
  const isEnsLoading = ensAvatarLoading || ensNameLoading

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
              ((isLoading || isEnsLoading) && (
                <Spinner size="xs" />
              )) ||
              undefined
            }
            onClick={handleCopyAddressToClipboard}
            fontFamily="Haffer"
            fontSize={12}
            _hover={{
              bg: "purple.dark",
              borderColor: "surface.tertiary",
            }}
          >
            {ensName ? ensName : truncateWalletAddress(address)}
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
        maxW="240px"
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
              href={`https://etherscan.io/address/${address}`}
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
            <Stack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={importAllToken}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <HStack>
                <LogoutCircleIcon />
                <Text fontWeight="semibold">
                  Import all tokens to wallet
                </Text>
              </HStack>

              <Flex wrap="wrap" gap={1.5}>
                {Object.values(cellarDataMap).map((item) => (
                  <Tooltip
                    key={item.config.id}
                    hasArrow
                    arrowShadowColor="purple.base"
                    label={item.name}
                    placement="bottom"
                    color="neutral.300"
                    bg="surface.bg"
                  >
                    <Avatar
                      src={item.config.lpToken.imagePath}
                      size="2xs"
                    />
                  </Tooltip>
                ))}
                <Tooltip
                  key="somm"
                  hasArrow
                  arrowShadowColor="purple.base"
                  label="somm"
                  placement="bottom"
                  color="neutral.300"
                  bg="surface.bg"
                >
                  <Avatar
                    src={config.CONTRACT.SOMMELLIER.IMAGE_PATH}
                    size="2xs"
                  />
                </Tooltip>
              </Flex>
            </Stack>
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
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
