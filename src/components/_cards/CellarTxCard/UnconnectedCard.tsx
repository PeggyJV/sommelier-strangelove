import { Text, VStack } from "@chakra-ui/react"
import ConnectButton from "components/_buttons/ConnectButton"
import { VFC } from "react"
import { useConnect } from "wagmi"
import { Card } from "../Card"

export const UnconnectedCard: VFC = () => {
  const { connectors } = useConnect()

  return (
    <Card
      display="flex"
      flexDir="column"
      justifyContent="center"
      p={2}
      h="auto"
      bg="surface.secondary"
    >
      <Card bg="backgrounds.black">
        <VStack spacing={8} justify="center">
          <Text color="neutral.400" maxW="30ch" textAlign="center">
            Please connect your wallet to start investing.
          </Text>
          {connectors.map((c) => (
            <ConnectButton connector={c} key={c.id} />
          ))}
        </VStack>
      </Card>
    </Card>
  )
}
