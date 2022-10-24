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
  useDisclosure,
} from "@chakra-ui/react"
import { Cellars } from "components/Cellars"
import { FAQStrategy } from "components/FAQStrategy"
import { Layout } from "components/Layout"
import { Strategy } from "components/Strategy"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { InformationIcon } from "components/_icons"
import { BaseModal } from "components/_modals/BaseModal"
import { cellarDataMap } from "data/cellarDataMap"
import { useApy } from "data/hooks/useApy"
import { useTvm } from "data/hooks/useTvm"
import { strategyPageContentData } from "data/strategyPageContentData"
import htmr from "htmr"
import { NextPage } from "next"
import { StrategyLandingPageProps } from "pages/strategies/[id]"
import { useState } from "react"
import { BsChevronDown } from "react-icons/bs"

export const PageStrategy: NextPage<StrategyLandingPageProps> = ({
  id,
  faqData,
  sectionCellars,
  sectionStrategies,
}) => {
  const content = strategyPageContentData[id]
  const [expandHowItWorks, setExpandHowItWorks] = useState(false)
  const howItWorks = content.howItWorks.split("<br/><br/>")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const tvm = useTvm(cellarConfig)
  const apy = useApy(cellarConfig)
  return (
    <Layout>
      <Stack direction="row" spacing={12}>
        <Stack spacing={8}>
          <Stack>
            <Heading size="4xl" fontWeight="900" as="h1">
              {content.name}
            </Heading>
            <Text fontWeight="semibold">
              by{" "}
              <Link
                textDecoration="underline"
                href={content.providerUrl}
              >
                {content.provider}
              </Link>
            </Text>
          </Stack>
          <Heading size="lg">{content.description}</Heading>
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
        </Stack>
        <Stack width="container.md" spacing={4}>
          <Link href={content.buyUrl} target="_blank">
            <BaseButton w="full" h="50px">
              Buy
            </BaseButton>
          </Link>
          <Link href={`/strategies/${id}/manage`}>
            <SecondaryButton w="full" h="50px">
              Manage Portofolio
            </SecondaryButton>
          </Link>
          <HStack
            pt={4}
            justifyContent="space-around"
            divider={<StackDivider borderColor="purple.dark" />}
          >
            <VStack>
              <Heading size="lg">
                {tvm.data?.formatted || "--"}
              </Heading>
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
              <Heading size="lg">
                {apy.data?.expectedApy ||
                  cellarData.overrideApy?.value ||
                  "--"}
              </Heading>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label={
                  cellarData.overrideApy
                    ? cellarData.overrideApy.tooltip
                    : apy.data?.apyLabel
                }
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
                    {cellarData.overrideApy?.title || "Expected APY"}
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
              {content.ticker}
            </HStack>
            <HStack>
              <Text w="150px" fontWeight="semibold">
                Traded Assets
              </Text>
              {content.tradedAssets}
            </HStack>
            <HStack>
              <Text w="150px" fontWeight="semibold">
                Alternative to
              </Text>
              <Text>{content.alternativeTo}</Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="column" mt={52} spacing="80px">
        <Stack spacing="40px">
          <Heading>Strategy Highlights</Heading>
          <SimpleGrid columns={3} spacing={4}>
            {content.strategyHighlights.card.map((item, index) => (
              <Box
                key={index}
                bg="rgba(78, 56, 156, 0.16)"
                px={4}
                py={10}
                rounded="xl"
              >
                <Heading size="md">{item}</Heading>
              </Box>
            ))}
          </SimpleGrid>
          <Text maxW="40rem" color="#D9D7E0">
            {content.strategyHighlights.description}
          </Text>
        </Stack>
        <Stack spacing="40px">
          <Heading>How it Works</Heading>
          <Text maxW="40rem" color="#D9D7E0">
            {expandHowItWorks
              ? htmr(content.howItWorks)
              : howItWorks[0]}
          </Text>
          {howItWorks.length > 1 && !expandHowItWorks && (
            <Box>
              <SecondaryButton
                rightIcon={<BsChevronDown />}
                onClick={() => setExpandHowItWorks(true)}
              >
                View More
              </SecondaryButton>
            </Box>
          )}
        </Stack>
        {content.backtestingImage && (
          <Stack maxW="40rem" spacing="40px">
            <Heading size="lg">
              All strategies available on Sommelier marketplace are
              comprehensively backtested.
            </Heading>
            <Box>
              <SecondaryButton onClick={onOpen}>
                View Backtesting Data
              </SecondaryButton>
            </Box>
            <BaseModal
              heading="Backtesting data"
              isOpen={isOpen}
              onClose={onClose}
              size="2xl"
            >
              <Image
                src={content.backtestingImage}
                alt="backtesting"
              />
            </BaseModal>
          </Stack>
        )}
      </Stack>
      <Cellars data={sectionCellars} mt={52} />
      <Strategy data={sectionStrategies} mt={52} />
      <FAQStrategy data={faqData} mt={52} />
    </Layout>
  )
}
