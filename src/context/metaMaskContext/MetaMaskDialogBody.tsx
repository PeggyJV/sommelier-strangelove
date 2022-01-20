import { FC } from 'react'
import { Text, Link } from '@chakra-ui/react'

const MetaMaskDialogBody: FC = () => {
  return (
    <>
      <Text>
        We use MetaMask to handle authentication and the delegation of funds on
        our platform. Please ensure you're using a supported brower and install
        their extension{' '}
        <Link href='https://metamask.io/download/' isExternal>
          here.
        </Link>
      </Text>
    </>
  )
}

export default MetaMaskDialogBody
