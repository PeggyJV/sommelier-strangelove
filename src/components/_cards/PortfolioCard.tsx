import {
  BoxProps,
  SimpleGrid,
  Stack,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { DepositButton } from "components/_buttons/DepositButton"
import { BondButton } from "components/_buttons/BondButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { ClaimButton } from "components/_buttons/ClaimButton"
import { tokenConfig } from "data/tokenConfig"
import { InlineImage } from "components/InlineImage"
import TransparentCard from "./TransparentCard"
import { TokenAssets } from "components/TokenAssets"

export const PortfolioCard: VFC<BoxProps> = () => {
  const [isLargerThan628] = useMediaQuery("(min-width: 628px)")
  const [isLessThan594] = useMediaQuery("(max-width: 594px)")
  const [isBetween444And595] = useMediaQuery(
    "(max-width: 444px) and (max-width: 595px)"
  )
  const [isBetween595And829] = useMediaQuery(
    "(min-width: 595px) and (max-width: 829px)"
  )
  const templateColumns = isBetween444And595
    ? "repeat(1, max-content)"
    : isBetween595And829
    ? "repeat(1, max-content)"
    : "repeat(2, max-content)"

  return (
    <TransparentCard px={10} py={6}>
      <CardStatRow
        spacing={14}
        align="flex-start"
        justify="flex-start"
        direction={isLessThan594 ? "column" : "row"}
        wrap="wrap"
        id="portfolio"
      >
        <SimpleGrid
          templateColumns={templateColumns}
          templateRows="repeat(2, 1fr)"
          spacing={4}
          alignItems="flex-end"
        >
          <CardStat
            label="net value"
            tooltip="Current value of your assets in Cellar"
          >
            $0.00
          </CardStat>
          <CardStat
            label="deposit assets"
            tooltip="Accepted deposit assets"
          >
            <TokenAssets tokens={tokenConfig} displaySymbol />
          </CardStat>
          <CardStat
            label="apy"
            tooltip="APY earned on your Principal since initial investment from Strategy"
          >
            0.00%
          </CardStat>
          <Stack
            spacing={3}
            direction={
              isLargerThan628
                ? "row"
                : isLessThan594
                ? "row"
                : "column"
            }
          >
            <DepositButton />
            <WithdrawButton />
          </Stack>
        </SimpleGrid>
        <SimpleGrid
          templateColumns={templateColumns}
          templateRows="repeat(2, 1fr)"
          spacing={4}
          alignItems="flex-end"
        >
          <VStack align="flex-start">
            <CardStat
              label="available tokens"
              tooltip="Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
            >
              <InlineImage
                src="/assets/icons/aave.svg"
                alt="aave logo"
              />
              0
            </CardStat>
          </VStack>
          <VStack align="flex-start">
            <CardStat
              label="bonded tokens"
              tooltip="Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
            >
              <InlineImage
                src="/assets/icons/aave.svg"
                alt="aave logo"
              />
              0
            </CardStat>
          </VStack>
          <BondButton />
        </SimpleGrid>
        <SimpleGrid
          templateColumns="max-content"
          templateRows="repeat(2, 1fr)"
          spacing={4}
          alignItems="flex-end"
        >
          <VStack align="flex-start">
            <CardStat
              label="rewards"
              tooltip="Amount of SOMM earned and available to be claimed"
            >
              <InlineImage
                src="/assets/icons/somm.svg"
                alt="aave logo"
              />
              0
            </CardStat>
          </VStack>
          <ClaimButton />
        </SimpleGrid>
      </CardStatRow>
    </TransparentCard>
  )
}
