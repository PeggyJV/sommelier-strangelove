import {
  Box,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import truncateWalletAddress from "src/utils/truncateWalletAddress"
import { useAccount } from "wagmi"
import { BsThreeDotsVertical } from "react-icons/bs"
import { CardDivider } from "components/_layout/CardDivider"
import { BaseButton } from "../BaseButton"
import {
  ControlsIcon,
  ExternalLinkIcon,
  LogoutIcon,
} from "components/_icons"

export const ConnectedPopover = () => {
  const [account, disconnect] = useAccount({
    fetchEns: true,
  })
  const walletAddress = account?.data?.address

  return (
    <Popover placement="bottom-end">
      <HStack spacing={2}>
        <BaseButton
          bg="surface.bg"
          borderWidth={8}
          borderColor="surface.primary"
          icon={BsThreeDotsVertical}
          minW="max-content"
          isLoading={account.loading}
        >
          {truncateWalletAddress(walletAddress)}
        </BaseButton>
        <PopoverTrigger>
          <BaseButton
            p={3}
            bg="surface.bg"
            borderWidth={8}
            borderColor="surface.primary"
            minW="max-content"
            isLoading={account.loading}
          >
            <ControlsIcon />
          </BaseButton>
        </PopoverTrigger>
      </HStack>
      <PopoverContent
        p={2}
        maxW="max-content"
        border="none"
        borderRadius={8}
        bg="surface.secondary"
        fontWeight="semibold"
      >
        <PopoverBody p={0} bg="surface.bg" borderRadius="inherit">
          <VStack
            align="flex-start"
            divider={<CardDivider p={0} m={0} />}
          >
            <Link
              href={`https://etherscan.io/address/${walletAddress}`}
              isExternal
              py={2}
              px={4}
              fontSize="sm"
            >
              <ExternalLinkIcon mr={2} />
              View on Etherscan
            </Link>
            <Box
              h="auto"
              py={2}
              px={4}
              fontSize="sm"
              onClick={disconnect}
              _hover={{
                cursor: "pointer",
              }}
            >
              <LogoutIcon mr={2} /> Disconnect Wallet
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
