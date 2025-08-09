import { FC } from "react"
import { Box, Flex, FlexProps, Text } from "@chakra-ui/react"

export const VaultsDisclaimer: FC<FlexProps> = (props) => {
  return (
    <Flex {...props}>
      <Box marginTop="64px" color="neutral.300" fontSize="xs">
        <Text marginBottom="1.5rem">
          Vault execution may use deterministic logic, AI models, or
          strategy providers. Legacy vaults can follow provider
          specific withdrawal rules. Review vault details before
          depositing.
        </Text>
      </Box>
    </Flex>
  )
}
