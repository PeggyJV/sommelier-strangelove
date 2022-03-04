import {
  Button,
  Divider,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@chakra-ui/react'
import Link from 'components/Link'
import truncateWalletAddress from 'src/utils/truncateWalletAddress'
import { useAccount } from 'wagmi'
import { BaseButton } from '../BaseButton'

export const ConnectedPopover = () => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const walletAddress = account?.data?.address

  return (
    <Popover>
      <PopoverTrigger>
        <BaseButton  minW='max-content' isLoading={account.loading}>
          {truncateWalletAddress(walletAddress)}
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent color='black'>
        <PopoverBody>
          <Link
            href={`https://etherscan.io/address/${walletAddress}`}
            isExternal
          >
            View on Etherscan
          </Link>
          <Divider my={1} />
          <Text>Switch Wallet Provider</Text>
          <Divider my={1} />
          <Button
            minW='max-content'
            colorScheme='red'
            onClick={disconnect}
            isLoading={account.loading}
          >
            Disconnect Wallet
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
