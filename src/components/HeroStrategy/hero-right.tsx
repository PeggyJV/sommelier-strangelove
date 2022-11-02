import {
  Heading,
  HStack,
  Link,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { InformationIcon } from "components/_icons"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { useApy } from "data/hooks/useApy"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useTvm } from "data/hooks/useTvm"
import { useWeekChange } from "data/hooks/useWeekChange"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

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
  const tvm = useTvm(cellarConfig)
  const apy = useApy(cellarConfig)
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
          <Heading size="md">{tokenPrice || "--"}</Heading>
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="1 token price which is calculated based on current BTC, ETH, and USDC prices vs their proportions in strategy vs minted tokens in strategy"
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
        <VStack>
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
            label="% of current token price vs token price 1 W(7 days) ago"
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
  )
}
