import { VFC } from "react"
import { Box, Flex, Input } from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { config } from "utils/config"
import { useFormContext } from "react-hook-form"

export const SwapSettingsCard: VFC = () => {
  const { register } = useFormContext()

  return (
    <Box
      w={150}
      px={6}
      py={4}
      position="absolute"
      top={-4}
      right={37}
      zIndex="999"
      bg="surface.bg"
      color="neutral.100"
      border="1px solid"
      borderColor="white"
      borderRadius={24}
    >
      <CardHeading fontSize="0.7rem">slippage tolerance</CardHeading>
      <Flex alignItems="center">
        <Input
          variant="unstyled"
          type="number"
          step="any"
          placeholder={config.SWAP.SLIPPAGE.toString()}
          fontSize="md"
          fontWeight={700}
          textAlign="right"
          mr={1}
          {...register("slippage", {
            required: "Enter slippage tolerance.",
            valueAsNumber: true,
            validate: {
              positive: (v) =>
                v >= 0 || "Enter a valid slippage percentage.",
              lessThanOrEqualToFiftyPercent: (v) =>
                v <= 50 || "Enter a valid slippage percentage.",
            },
          })}
        />
        %
      </Flex>
    </Box>
  )
}
