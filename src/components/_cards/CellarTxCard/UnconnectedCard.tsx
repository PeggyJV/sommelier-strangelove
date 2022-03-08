import { Text, VStack } from '@chakra-ui/react'
import ConnectButton from 'components/_buttons/ConnectButton'
import { VFC } from 'react'
import { useConnect } from 'wagmi'
import { Card } from '../Card'

export const UnconnectedCard: VFC = () => {
  const [auth] = useConnect()

  return (
    <Card
      display='flex'
      flexDir='column'
      justifyContent='center'
      h='100%'
      bg='backgrounds.darker'
    >
      <VStack spacing={8} justify='center'>
        <Text color='text.body.lightMuted' maxW='30ch' textAlign='center'>
          Please connect your wallet to start investing.
        </Text>
        {auth.data.connectors.map(c => (
          <ConnectButton connector={c} key={c.id} />
        ))}
      </VStack>
    </Card>
  )
}
