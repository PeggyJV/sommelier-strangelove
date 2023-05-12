import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { TransparentCard } from "components/_cards/TransparentCard"
import { LogoIcon } from "components/_icons"
import { useHome } from "data/context/homeContext"
import { useUserDataAllStrategies } from "data/hooks/useUserDataAllStrategies"
import { PortofolioItem } from "./PortofolioItem"

export const YourPortofolio = () => {
  const { data, isLoading, refetch } = useUserDataAllStrategies()
  const { timeline } = useHome()
  return (
    <VStack spacing="32px" w="full" mt={16}>
      <TransparentCard
        fontFamily="Haffer"
        w="100%"
        paddingX={0}
        pt={3}
      >
        <VStack alignItems="flex-start" w="100%" spacing={0}>
          <Text marginX="auto" fontWeight={600} fontSize="16px">
            Your total balance
          </Text>
          <Text
            as="h3"
            fontWeight={700}
            fontSize="40px"
            marginX="auto !important"
          >
            $ 250.000
          </Text>
          <Box
            py="19px"
            px={8}
            w="100%"
            borderTop="1px solid"
            borderBottom="1px solid"
            borderColor="surface.secondary"
          >
            <Text fontSize={12} fontWeight={600} color="neutral.400">
              Strategy
            </Text>
          </Box>
          <Box w="100%">
            <PortofolioItem />
            <PortofolioItem />
          </Box>
          <Box
            py="19px"
            px={8}
            w="100%"
            borderBottom="1px solid"
            borderColor="rgba(255, 255, 255, 0.05)"
          >
            <Text fontSize={12} fontWeight={600} color="neutral.400">
              Unclaimed Rewards
            </Text>
          </Box>
          <HStack
            px={8}
            py={4}
            pl={12}
            pb={1}
            borderColor="surface.secondary"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack spacing={4}>
              <LogoIcon color="red.normal" p={0} boxSize="30px" />
              <HStack spacing={0} h="100%" alignItems="flex-start">
                <Text as="h6" fontSize={16} fontWeight={700}>
                  SOMM
                </Text>
              </HStack>
            </HStack>
            <VStack
              spacing={0}
              h="100%"
              alignSelf="baseline"
              alignItems="flex-end"
              textAlign="right"
            >
              <Text as="h6" fontSize={16} fontWeight={700}>
                $15.04
              </Text>
              <Text
                fontWeight={500}
                fontSize={12}
                color="neutral.400"
              >
                1,103.00 SOMM
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </TransparentCard>
    </VStack>
  )
}
