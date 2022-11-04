import {
  Box,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
// import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { InformationIcon } from "components/_icons"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useWeekChange } from "data/hooks/useWeekChange"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"
// import { FaArrowDown, FaArrowUp } from "react-icons/fa"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight: VFC<HeroStrategyRightProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: weekChange } = useWeekChange(cellarConfig)

  return (
    <Stack maxWidth="container.md" spacing={4}>
      <BaseButton w="full" h="50px" onClick={buyOrSellModal.onOpen}>
        Buy / Sell
      </BaseButton>
      <BuyOrSellModal
        uniswapLink={content.buyUrl}
        id={id}
        isOpen={buyOrSellModal.isOpen}
        onClose={buyOrSellModal.onClose}
      />
      <Link
        href={`/strategies/${id}/manage`}
        style={{ textDecoration: "none" }}
      >
        <SecondaryButton w="full" h="50px">
          Manage Portfolio
        </SecondaryButton>
      </Link>
      <HStack
        pt={4}
        justifyContent="space-around"
        divider={<StackDivider borderColor="purple.dark" />}
      >
        <VStack>
          <Heading size="md">{tokenPrice || <Spinner />}</Heading>
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
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
                Token Price
              </Label>
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </VStack>

        {/* REMOVE COMMENT TO DISPLAY 1W CHANGE PERCENTAGE */}
        {/* <VStack>
          {weekChange && (
            <PercentageText
              data={weekChange}
              positiveIcon={FaArrowUp}
              negativeIcon={FaArrowDown}
              headingSize="md"
            />
          )}
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="% change of current token price vs. token price 1 week ago"
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
                1W Change
              </Label>

              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </VStack> */}
      </HStack>
      <Stack pt={4} spacing={4} color="neutral.300">
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Ticker
            </Text>
          </Box>
          {content.ticker}
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Traded Assets
            </Text>
          </Box>
          {content.tradedAssets}
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Alternative to
            </Text>
          </Box>
          <Text>{content.alternativeTo}</Text>
        </HStack>
      </Stack>
    </Stack>
  )
}
