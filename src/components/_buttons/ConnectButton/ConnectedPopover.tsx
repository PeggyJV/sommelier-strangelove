import {
  Button,
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
          bg="black"
          borderColor="backgrounds.glassy"
          icon={BsThreeDotsVertical}
          minW="max-content"
          isLoading={account.loading}
        >
          {truncateWalletAddress(walletAddress)}
        </BaseButton>
        <PopoverTrigger>
          <BaseButton
            p={3}
            bg="black"
            borderColor="backgrounds.glassy"
            minW="max-content"
            isLoading={account.loading}
          >
            <ControlsIcon />
          </BaseButton>
        </PopoverTrigger>
      </HStack>
      <PopoverContent
        border="none"
        maxW="max-content"
        bg="black"
        borderWidth={8}
        borderColor="backgrounds.glassy"
        fontWeight="semibold"
      >
        <PopoverBody>
          <VStack align="flex-start" divider={<CardDivider />}>
            <Link
              href={`https://etherscan.io/address/${walletAddress}`}
              isExternal
              fontSize="sm"
            >
              <ExternalLinkIcon mr={2} />
              View on Etherscan
            </Link>
            <Button
              p={0}
              variant="unstyled"
              fontSize="sm"
              onClick={disconnect}
              isLoading={account.loading}
            >
              <LogoutIcon mr={2} /> Disconnect Wallet
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
