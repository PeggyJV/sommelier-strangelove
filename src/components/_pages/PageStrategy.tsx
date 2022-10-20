import {
  Heading,
  Stack,
  Text,
  Button,
  Box,
  SimpleGrid,
  HStack,
  Circle,
  Link,
  Tooltip,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { InformationIcon } from "components/_icons"
import { NextPage } from "next"

type PageStrategyProps = {
  id: string
}

export const PageStrategy: NextPage<PageStrategyProps> = ({ id }) => {
  return (
    <Layout>
      <Stack direction="row" spacing={12}>
        <Stack spacing={8}>
          <Stack>
            <Heading size="4xl" fontWeight="900" as="h1">
              ETH-BTC Trend Strategy
            </Heading>
            <Text fontWeight="semibold">
              by{" "}
              <Link
                textDecoration="underline"
                href="https://cleargate.capital/"
              >
                Cleargate Capital
              </Link>
            </Text>
          </Stack>
          <Heading size="lg">
            Strategy portfolio buys BTC and ETH when prices go up.
            Fully or partially sells both assets when prices go down.
          </Heading>
          <HStack spacing={8} pt={10}>
            <Circle size={16} bgColor="red" />
            <Stack>
              <Text fontWeight="semibold" fontSize="xl">
                Automated Asset Management Included
              </Text>
              <Text>
                Buy the token to get exposure to the strategy
                portfolio, and sell it when you want to exit. Smart
                contract algorithms manage the rest.
              </Text>
            </Stack>
          </HStack>
        </Stack>
        <Stack width="container.md" spacing={4}>
          <BaseButton h="50px">Buy</BaseButton>
          <SecondaryButton h="50px">
            Manage Portofolio
          </SecondaryButton>
          <HStack>
            <Heading size="md">$1.09M</Heading>
            <Tooltip
              hasArrow
              arrowShadowColor="purple.base"
              label="Total value managed by Cellar"
              placement="top"
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={1} align="center">
                <Label
                  ml={1}
                  color="neutral.300"
                  display="flex"
                  alignItems="center"
                  columnGap="4px"
                >
                  TVM
                </Label>

                <InformationIcon color="neutral.300" boxSize={3} />
              </HStack>
            </Tooltip>
          </HStack>
        </Stack>
      </Stack>
      <Stack direction="column" mt={28} spacing="80px">
        <Stack spacing="40px">
          <Heading>Strategy Highlights</Heading>
          <SimpleGrid columns={3} spacing={4}>
            <Box
              bg="rgba(78, 56, 156, 0.16)"
              px={4}
              py={10}
              rounded="xl"
            >
              <Heading size="md">
                Holds a combination of BTC and ETH with smart
                rebalancing depending on market conditions.
              </Heading>
            </Box>
            <Box
              bg="rgba(78, 56, 156, 0.16)"
              px={4}
              py={10}
              rounded="xl"
            >
              <Heading size="md">
                High exposure to BTC and ETH when price trend goes up,
                no exposure when the trend is down.
              </Heading>
            </Box>
            <Box
              bg="rgba(78, 56, 156, 0.16)"
              px={4}
              py={10}
              rounded="xl"
            >
              <Heading size="md">
                Risk management rules to reduce risks in unfavorable
                market.
              </Heading>
            </Box>
          </SimpleGrid>
          <Text maxW="34vw" color="#D9D7E0">
            ETH-BTC Trend strategy aims to provide a better
            risk-return tradeoff than holding ETH and/or BTC. The
            strategy follows upward price trends and exits the market
            when no positive trend is detected. The goal is to
            overperform simple buy and hold strategy, cut losses
            during market downturn, and re-establish the long position
            after prices start to go up, so that Sommelier users will
            not miss out any subsequent price appreciation.
          </Text>
        </Stack>
        <Stack spacing="40px">
          <Heading>How it Works</Heading>
          <Text maxW="34vw" color="#D9D7E0">
            ETH-BTC Trend strategy aims to provide a better
            risk-return tradeoff than holding ETH and/or BTC. The
            strategy follows upward price trends and exits the market
            when no positive trend is detected. The goal is to
            overperform simple buy and hold strategy, cut losses
            during market downturn, and re-establish the long position
            after prices start to go up, so that Sommelier users will
            not miss out any subsequent price appreciation.
          </Text>
          <Box>
            <Button
              color="neutral.100"
              border="2px solid"
              borderColor="#6C4ED9"
              backgroundColor="rgba(78, 56, 156, 0.32)"
              _hover={{
                backgroundColor: "rgba(78, 56, 156, 0.32)",
              }}
            >
              View More
            </Button>
          </Box>
        </Stack>
        <Stack maxW="34vw" spacing="40px">
          <Heading size="lg">
            All strategies available on Sommelier marketplace are
            comprehensively backtested.
          </Heading>
        </Stack>
      </Stack>
    </Layout>
  )
}
