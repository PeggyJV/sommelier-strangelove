import {
  HStack,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import { ArrowRightIcon } from "components/_icons"
import Image from "next/image"

export const About = () => {
  const features = [
    {
      title: "You own the keys",
      description: "Non-custodial—you control your funds.",
      icon: "/assets/images/youOwnTheKeys.svg",
    },
    {
      title: "Strategies by experts",
      description: "Providers with years of combined experience.",
      icon: "/assets/images/strategiesByExperts.svg",
    },
    {
      title: "Smart risk management",
      description: "Control and manage risk using machine learning.",
      icon: "/assets/images/smartRiskManagement.svg",
    },
    {
      title: "Fully backtested",
      description: "Backtested with real market data.",
      icon: "/assets/images/fullyBacktested.svg",
    },
  ]

  return (
    <Flex marginTop="62px" color="neutral.300" flexDirection="column">
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" fontSize="21px">
          About
        </Text>
        <Link isExternal href="https://sommelier.finance">
          <Button
            display="flex"
            flexDir="row"
            variant="unstyled"
            rightIcon={<ArrowRightIcon />}
          >
            <Text>Learn more</Text>
          </Button>
        </Link>
      </HStack>
      <SimpleGrid columns={2} w="full" spacingY="24px">
        {features.map((feature) => (
          <HStack key={feature.title}>
            <Image
              src={feature.icon}
              alt={feature.title}
              width={60}
              height={60}
            />
            <Stack spacing={0}>
              <Text fontWeight="bold" fontSize="16px">
                {feature.title}
              </Text>
              <Text fontSize="12px" color="neutral.400">
                {feature.description}
              </Text>
            </Stack>
          </HStack>
        ))}
      </SimpleGrid>
    </Flex>
  )
}
