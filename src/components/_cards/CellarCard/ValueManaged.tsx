import { Flex, Heading, Box } from "@chakra-ui/react"
import { FillLine } from "./FillLine"
import { Label } from "./Label"

export const ValueManaged = () => {
  return (
    <Box>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">$49.25M</Heading>
        <Label ml={1}>TVM</Label>
      </Flex>
      <Flex alignItems="center" mb={4}>
        <Heading size="sm" color="lime">
          $2,012,394.79 (4.08%)
        </Heading>
        <Label ml={1}>Past Week</Label>
      </Flex>
      <FillLine percentage={46} mb={3} />
      <Flex justifyContent="space-between">
        <Label>Cellar Cap</Label>
        <Heading size="xs">$100M USDC</Heading>
      </Flex>
    </Box>
  )
}
