import {
  ButtonProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useToast,
  Image,
  Text,
  HStack,
  Spinner,
  Portal,
} from "@chakra-ui/react"
import { BaseButton, BaseButtonProps } from "../BaseButton"
import { MoneyWalletIcon } from "components/_icons"
import { useAccount, useConnect } from "wagmi"
import React from "react"
import { analytics } from "utils/analytics"
import { ConnectButtonProps } from "."
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

export const ConnectWalletPopover = ({
  unstyled,
  ...rest
}: ConnectButtonProps) => {
  const toast = useToast()
  const {
    isConnected,
    isConnecting,
    connector: activeConnector,
  } = useAccount()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  /**
   * - If connector is ready (window.ethereum exists), it'll detect the connector
   *   color scheme and attempt to connect on click.
   *
   * - If connector is not ready (window.ethereum does not exist), it'll render
   *   as an anchor and opens MetaMask download page in a new tab
   */
  const conditionalProps = React.useMemo<ButtonProps>(() => {
    return !isConnected
      ? // connector ready props
        {
          onClick: () => {
            analytics.track("wallet.connect-started")
          },
        }
      : // connector not ready props
        {
          as: "a",
          href: "https://metamask.io/download",
          target: "_blank",
        }
  }, [isConnected])

  const styles: BaseButtonProps | false = !unstyled && {
    p: 3,
    bg: "surface.primary",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "surface.secondary",
    minW: "max-content",
    fontFamily: "Haffer",
    fontSize: 12,
    icon: MoneyWalletIcon,
    iconProps: {
      bgColor: "unset",
      borderRadius: "unset",
      _groupHover: {
        bgColor: "unset",
      },
    },
    _hover: {
      bg: "purple.dark",
      borderColor: "surface.tertiary",
    },
  }

  const { connect, connectors, pendingConnector } = useConnect({
    onError: (error) => {
      toast({
        title: "Connection failed!",
        description: error.message,
        status: "error",
        isClosable: true,
      })

      analytics.track("wallet.connect-failed", {
        error: error.name,
        message: error.message,
      })
    },
    onSuccess: (data) => {
      const { account } = data
      toast({
        title: "Connected",
        description: "Your wallet is connected",
        status: "success",
        isClosable: true,
      })
      if (account && account.length) {
        analytics.track("wallet.connect-succeeded", {
          account,
          connector: activeConnector?.name,
        })
      }
    },
  })

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <BaseButton {...styles} {...rest} {...conditionalProps}>
          Connect {isLarger768 && "Wallet"}
        </BaseButton>
      </PopoverTrigger>
      <Portal>
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
              {connectors
                .filter(
                  (x) => x.ready && x.id !== activeConnector?.id
                )
                .map((x) => (
                  <Stack
                    key={x.id}
                    as="button"
                    py={2}
                    px={4}
                    fontSize="sm"
                    onClick={() => {
                      analytics.track("wallet.connect-started", {
                        connector: activeConnector?.name,
                      })
                      connect({ connector: x })
                    }}
                    _hover={{
                      cursor: "pointer",
                      bg: "purple.dark",
                      borderColor: "surface.tertiary",
                    }}
                  >
                    <HStack>
                      {isConnecting &&
                      x.id === pendingConnector?.id ? (
                        <Spinner />
                      ) : (
                        <Image
                          src={`/assets/icons/${x?.name?.toLowerCase()}.svg`}
                          alt="wallet logo"
                          boxSize={6}
                        />
                      )}

                      <Text fontWeight="semibold">{x.name}</Text>
                    </HStack>
                  </Stack>
                ))}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
