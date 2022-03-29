import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack
} from '@chakra-ui/react'
import Link from 'components/Link'
import truncateWalletAddress from 'src/utils/truncateWalletAddress'
import { useAccount } from 'wagmi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CardDivider } from 'components/_layout/CardDivider'
import { GradientButton } from '../GradientButton'

export const ConnectedPopover = () => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const walletAddress = account?.data?.address

  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>
        <GradientButton
          icon={BsThreeDotsVertical}
          minW='max-content'
          isLoading={account.loading}
        >
          {truncateWalletAddress(walletAddress)}
        </GradientButton>
      </PopoverTrigger>
      <PopoverContent border='none' maxW='max-content' bg='backgrounds.dark'>
        <PopoverBody>
          <VStack align='flex-start' divider={<CardDivider />}>
            <Link
              href={`https://etherscan.io/address/${walletAddress}`}
              isExternal
            >
              View on Etherscan
            </Link>
            <Button
              variant='unstyled'
              _hover={{
                textDecoration: 'underline'
              }}
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
