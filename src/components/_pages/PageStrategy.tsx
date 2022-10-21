import {
  Heading,
  Stack,
  Text,
  Box,
  SimpleGrid,
  HStack,
  Link,
  Tooltip,
  Image,
  VStack,
  StackDivider,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { ArrowDownIcon, InformationIcon } from "components/_icons"
import { NextPage } from "next"
import { StrategyLandingPageProps } from "pages/strategies/[id]"
import { BsChevronDown } from "react-icons/bs"

export const PageStrategy: NextPage<StrategyLandingPageProps> = ({
  id,
  faqData,
  sectionCellars,
  sectionStrategies,
}) => {
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
            <Image
              ml={-6}
              src="/assets/images/asset-management.png"
              alt="asset management image"
            />
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
          <HStack color="neutral.300">
            <ArrowDownIcon />
            <Text>Learn More</Text>
          </HStack>
        </Stack>
        <Stack width="container.md" spacing={4}>
          <BaseButton h="50px">Buy</BaseButton>
          <SecondaryButton h="50px">
            Manage Portofolio
          </SecondaryButton>
          <HStack
            pt={4}
            justifyContent="space-around"
            divider={<StackDivider borderColor="purple.dark" />}
          >
            <VStack>
              <Heading size="lg">$1.09M</Heading>
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
            </VStack>
            <VStack>
              <Heading size="lg">16.2%</Heading>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="APY"
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
                    Backtested APY
                  </Label>

                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
            </VStack>
          </HStack>
          <Stack pt={4} spacing={4} color="neutral.300">
            <HStack>
              <Text w="150px" fontWeight="semibold">
                Ticker
              </Text>
              <Image
                alt="eth btc trend"
                src="/assets/icons/eth-btc-trend.svg"
                boxSize={8}
              />
              <Text>ETHBTCTrend</Text>
            </HStack>
            <HStack>
              <Text w="150px" fontWeight="semibold">
                Traded Assets
              </Text>
              <Image
                alt="eth btc trend"
                src="/assets/icons/eth.png"
                boxSize={8}
              />
              <Image
                alt="eth btc trend"
                src="/assets/icons/btc.png"
                boxSize={8}
              />
            </HStack>
            <HStack>
              <Text w="150px" fontWeight="semibold">
                Alternative to
              </Text>
              <Text>Holding ETH or BTC</Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="column" mt={24} spacing="80px">
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
            <SecondaryButton rightIcon={<BsChevronDown />}>
              View More
            </SecondaryButton>
          </Box>
        </Stack>
        <Stack maxW="34vw" spacing="40px">
          <Heading size="lg">
            All strategies available on Sommelier marketplace are
            comprehensively backtested.
          </Heading>
          <Box>
            <SecondaryButton>View Backtesting Data</SecondaryButton>
          </Box>
        </Stack>
      </Stack>
    </Layout>
  )
}
