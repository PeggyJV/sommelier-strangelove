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
import truncateWalletAddress from "src/utils/truncateWalletAddress"
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
import { useImportToken } from "hooks/web3/useImportToken"
import { cellarDataMap } from "data/cellarDataMap"
import { useBrandedToast } from "hooks/chakra"
import { config } from "utils/config"
import { useRouter } from "next/router"
import { CellarNameKey } from "data/types"

export const ConnectedPopover = () => {
  const { addToast, close } = useBrandedToast()
  const { disconnect } = useDisconnect()
  const { address, isConnecting } = useAccount()
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
  })
  const { data: ensAvatar, isLoading: ensAvatarLoading } =
    useEnsAvatar({
      address: address,
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

  const id = useRouter().query.id as string | undefined
  const selectedStrategy = (!!id && cellarDataMap[id]) || undefined

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

      addToast({
        heading: "Copied to clipboard",
        body: <Text>Wallet address copied to clipboard</Text>,
        status: "success",
      })
    }
  }

  // to make sure the loading is about not about fetching ENS
  const isLoading = isConnecting && !address
  const isEnsLoading = ensAvatarLoading || ensNameLoading

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <BaseButton
          bg="none"
          borderWidth={2}
          borderColor="purple.base"
          borderRadius="full"
          rightIcon={
            <HStack>
              {walletAddressIcon()}
              <ChevronDownIcon />
            </HStack>
          }
          w="auto"
          zIndex={401}
          isLoading={isLoading}
          // loading state fetching ENS
          leftIcon={
            ((isLoading || isEnsLoading) && <Spinner size="xs" />) ||
            undefined
          }
          fontFamily="Haffer"
          fontSize={12}
          _hover={{
            bg: "purple.dark",
          }}
        >
          {ensName ? ensName : truncateWalletAddress(address)}
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
            {selectedStrategy && (
              <>
                {selectedStrategy.config.cellarNameKey !==
                  CellarNameKey.AAVE && (
                  <Stack
                    as="button"
                    py={2}
                    px={4}
                    fontSize="sm"
                    onClick={() => {
                      importToken.mutate({
                        address:
                          selectedStrategy.config.lpToken.address,
                      })
                    }}
                    _hover={{
                      cursor: "pointer",
                      bg: "purple.dark",
                      borderColor: "surface.tertiary",
                    }}
                  >
                    <HStack>
                      <Avatar
                        src={
                          selectedStrategy.config.lpToken.imagePath
                        }
                        size="2xs"
                      />
                      <Text fontWeight="semibold">
                        Import {selectedStrategy.name} to Wallet
                      </Text>
                    </HStack>
                  </Stack>
                )}

                <Stack
                  as="button"
                  py={2}
                  px={4}
                  fontSize="sm"
                  onClick={() => {
                    const fullImageUrl = `${window.origin}${config.CONTRACT.SOMMELLIER.IMAGE_PATH}`
                    importToken.mutate({
                      address: config.CONTRACT.SOMMELLIER.ADDRESS,
                      imageUrl: fullImageUrl,
                    })
                  }}
                  _hover={{
                    cursor: "pointer",
                    bg: "purple.dark",
                    borderColor: "surface.tertiary",
                  }}
                >
                  <HStack>
                    <Avatar
                      src={config.CONTRACT.SOMMELLIER.IMAGE_PATH}
                      size="2xs"
                    />
                    <Text fontWeight="semibold">
                      Import Reward token to Wallet
                    </Text>
                  </HStack>
                </Stack>
              </>
            )}
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
            {/* Import SOMM token to Wallet - Always Visible */}
            <Stack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={() => {
                const fullImageUrl = `${window.origin}${config.CONTRACT.SOMMELLIER.IMAGE_PATH}`
                importToken.mutate({
                  address: config.CONTRACT.SOMMELLIER.ADDRESS,
                  imageUrl: fullImageUrl,
                })
              }}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <HStack>
                <Avatar
                  src={config.CONTRACT.SOMMELLIER.IMAGE_PATH}
                  size="2xs"
                />
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
