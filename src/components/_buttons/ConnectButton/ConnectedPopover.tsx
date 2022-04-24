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
            ...
          </BaseButton>
        </PopoverTrigger>
      </HStack>
      <PopoverContent
        border="none"
        maxW="max-content"
        bg="energyYellow"
        color="black"
      >
        <PopoverBody>
          <VStack align="flex-start" divider={<CardDivider />}>
            <Link
              href={`https://etherscan.io/address/${walletAddress}`}
              isExternal
            >
              View on Etherscan
            </Link>
            <Button
              p={0}
              variant="unstyled"
              fontWeight="normal"
              fontSize="lg"
              onClick={disconnect}
              isLoading={account.loading}
            >
              Disconnect Wallet
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
