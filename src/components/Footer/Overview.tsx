import { HStack, Text } from "@chakra-ui/react"
import { TransparentCard } from "components/_cards/TransparentCard"
import { cellarDataMap } from "src/data/cellarDataMap"

export const Overview = () => {
  // Just length of map cellarDataMap
  const totalLaunchedStrategies = Object.keys(cellarDataMap).length

  return (
    <TransparentCard marginTop="32px" py="14px" px="24px">
      <HStack justifyContent="center" spacing="12px">
        <Text fontSize="sm" fontWeight="semibold" color="neutral.400">
          Total Vaults
        </Text>
        <Text fontSize="xl" fontWeight="bold">
          {String(totalLaunchedStrategies)}
        </Text>
      </HStack>
    </TransparentCard>
  )
}
