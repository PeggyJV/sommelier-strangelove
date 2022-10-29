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
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { Label } from "components/_cards/CellarCard/Label"
import { InformationIcon } from "components/_icons"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { useApy } from "data/hooks/useApy"
import { useTvm } from "data/hooks/useTvm"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"

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
          <Heading size="lg">{tvm.data?.formatted || "--"}</Heading>
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="Total value managed by Strategy"
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
  )
}
