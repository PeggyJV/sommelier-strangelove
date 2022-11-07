import {
  Box,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useDailyChange } from "data/hooks/useDailyChange"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"
import { PercentageText } from "components/PercentageText"
import { CellarStatsLabel } from "components/_cards/CellarCard/CellarStats"
import { useTvm } from "data/hooks/useTvm"

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
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const tvm = useTvm(cellarConfig)

  return (
    <Stack minW={"280px"} spacing={4}>
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
          <CellarStatsLabel
            tooltip="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
            title="Token Price"
          />
        </VStack>

        <VStack>
          {dailyChange && (
            <PercentageText data={dailyChange} headingSize="md" />
          )}
          <CellarStatsLabel
            tooltip="% change of current token price vs. token price yesterday"
            title="1D Change"
          />
        </VStack>
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
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Total Value
            </Text>
          </Box>
          <Text>
            {tvm.isLoading ? (
              <Spinner />
            ) : (
              tvm.data?.formatted || "--"
            )}
          </Text>
        </HStack>
      </Stack>
    </Stack>
  )
}
